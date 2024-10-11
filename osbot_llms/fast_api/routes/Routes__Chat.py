import asyncio
import traceback

from fastapi                                                                import Request
from fastapi.params import Header, Body
from osbot_utils.helpers.Random_Guid import Random_Guid
from osbot_utils.utils.Dev import pprint
from starlette.responses                                                    import StreamingResponse
from osbot_fast_api.api.Fast_API_Routes                                     import Fast_API_Routes
from osbot_utils.context_managers.capture_duration                          import capture_duration
from osbot_llms.OSBot_LLMs__Shared_Objects                                  import osbot_llms__shared_objects
from osbot_llms.fast_api.routes.Routes__OpenAI                              import Routes__OpenAI
from osbot_llms.llms.chats.LLM__Chat_Completion__Resolve_Engine             import LLM__Chat_Completion__Resolve_Engine
from osbot_llms.llms.storage.Chats_Storage__S3_Minio                        import Chats_Storage__S3_Minio
from osbot_llms.models.LLMs__Chat_Completion import LLMs__Chat_Completion, SWAGGER_EXAMPLE__LLMs__Chat_Completion

ROUTES_PATHS__CONFIG        = ['/config/status', '/config/version']
HEADER_NAME__CHAT_ID        = 'osbot-llms-chat-id'
HEADER_NAME__CHAT_THREAD_ID = 'osbot-llms-thread-id'
HEADER_NAME__CHAT_PLATFORM  = 'osbot-llms-platform'
HEADER_NAME__CHAT_PROVIDER  = 'osbot-llms-provider'
HEADER_NAME__CHAT_MODEL     = 'osbot-llms-model'

class Routes__Chat(Fast_API_Routes):
    tag                     : str = 'chat'
    chats_storage_s3_minio  : Chats_Storage__S3_Minio

    def execute_llm_request(self, llm_chat_completion):
        llm_platform_engine = LLM__Chat_Completion__Resolve_Engine().map_provider(llm_chat_completion)
        if llm_platform_engine:
            return llm_platform_engine.execute_request()
        return 'no engine'

    async def handle_other_llms(self, llm_chat_completion: LLMs__Chat_Completion, request: Request, request_id: str):
        stream = llm_chat_completion.stream
        if stream:
            return StreamingResponse(self.handle_other_llms__streamer(llm_chat_completion, request, request_id), media_type='text/event-stream"; charset=utf-8')
        else:
            return await self.handle_other_llms__no_stream(llm_chat_completion, request, request_id)

    async def handle_other_llms__no_stream(self, llm_chat_completion: LLMs__Chat_Completion, request: Request, request_id: str):
        complete_answer =  self.execute_llm_request(llm_chat_completion)
        try:
            #request_headers = {key: value for key, value in request.headers.items()}
            llm_chat_completion.llm_answer = complete_answer
        except:
            pass
        return complete_answer

    async def handle_other_llms__streamer(self, llm_chat_completion: LLMs__Chat_Completion, request: Request,  request_id: str):
        with capture_duration() as duration:
            complete_answer = ''
            async def simulated_api_call():                         # Simulating the response of the async API call
                #user_data = llm_chat_completion.user_data or {}

                response =  self.execute_llm_request(llm_chat_completion)
                for chunk in response:
                    await asyncio.sleep(0)                           # this is needed to trigger sending the data back (without it, we don't get streaming)
                    yield chunk

            generator = simulated_api_call()
            async for answer in generator:
                if answer:
                    complete_answer += answer
                    yield f"{answer}\n"

        try:
            llm_chat_completion.llm_answer = complete_answer
            self.chats_storage_s3_minio.save_user_response(llm_chat_completion, request_id)
            # if hasattr(request.state, "http_events"):                                 # todo: see if this is still needed (originaly this handled the case when the trace_calls did not handled ok the streamed responses
            #     http_events : Fast_API__Http_Events = request.state.http_events
            #     http_events.on_response_stream_completed(request)             # todo: rewrite this
            #print(f">>>>>>>>>>>>>>> STREAM COMPLETED: {request.state._state}")
        except Exception as error:
            print(f"[error][handle_other_llms__streamer] : {error}")        # todo: log this error
            traceback.print_exc()


    async def completion(self, request: Request, llm_chat_completion: LLMs__Chat_Completion = SWAGGER_EXAMPLE__LLMs__Chat_Completion, llm_api_key:str = Header(default="xxxx.aaaa.bbbb.xxxx")):
        request_id       = self.request_id(request)
        chat_save_result = self.chats_storage_s3_minio.save_user_request(llm_chat_completion, request_id)

        routes_open_ai   = Routes__OpenAI()
        user_data        = llm_chat_completion.user_data
        if user_data is None:
            user_data = dict(selected_platform = llm_chat_completion.llm_platform ,
                             selected_provider = llm_chat_completion.llm_provider ,
                             selected_model    = llm_chat_completion.llm_model    )
            llm_chat_completion.user_data = user_data

        # for now use the code in routes_open_ai.prompt_with_system__stream which is already working for OpenAI
        if user_data and 'selected_platform' in user_data and user_data.get('selected_platform') != 'OpenAI (Paid)':
            response = await self.handle_other_llms(llm_chat_completion, request, request_id)
            if type(response) == StreamingResponse:
                response.headers.append(HEADER_NAME__CHAT_ID       , chat_save_result.get('public_chat_id'        ) or '')
                response.headers.append(HEADER_NAME__CHAT_THREAD_ID, chat_save_result.get('public_chat_thread__id') or '')
                response.headers.append(HEADER_NAME__CHAT_PLATFORM , user_data.get('selected_platform'            ) or '')
                response.headers.append(HEADER_NAME__CHAT_PROVIDER , user_data.get('selected_provider'            ) or '')
                response.headers.append(HEADER_NAME__CHAT_MODEL    , user_data.get('selected_model'               ) or '')
            return response
        else:
            stream = llm_chat_completion.stream
            if stream:
                return await routes_open_ai.prompt_with_system__stream(llm_chat_completion, request)
            else:
                return await routes_open_ai.prompt_with_system__not_stream(llm_chat_completion, request)

    def request_id(self, request: Request):
        if request:
            if hasattr(request.state, "request_id"):
                return request.state.request_id

    # todo: refactor this method into a new Routes class (one focused on viewing chat threads)
    async def view(self, chat_id: str):
        s3_db_chat_threads = osbot_llms__shared_objects.s3_db_chat_threads()
        server_name = s3_db_chat_threads.server_name
        s3_key = f'chat-threads/{server_name}/{chat_id}/user-response.json.gz'
        return osbot_llms__shared_objects.s3_db_chat_threads().s3_file_data(s3_key)

    def setup_routes(self):
        self.router.post("/completion")(self.completion )
        self.router.get("/view"       )(self.view)
