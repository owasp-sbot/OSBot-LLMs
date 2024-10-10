import asyncio
import traceback

from fastapi                                                            import Request
from starlette.responses                                                import StreamingResponse
from cbr_athena.athena__fastapi.routes.Routes__OpenAI                   import Routes__OpenAI
from cbr_athena.aws.dynamo_db.DyDB__CBR_Chat_Threads                    import log_llm_chat
from cbr_athena.llms.chats.LLM__Chat_Completion__Resolve_Engine         import LLM__Chat_Completion__Resolve_Engine
from cbr_athena.llms.storage.CBR__Chats_Storage__Local                  import CBR__Chats_Storage__Local
from cbr_athena.llms.storage.CBR__Chats_Storage__S3                     import CBR__Chats_Storage__S3
from cbr_shared.schemas.base_models.chat_threads.LLMs__Chat_Completion  import LLMs__Chat_Completion
from osbot_fast_api.api.Fast_API_Routes                                 import Fast_API_Routes
from osbot_utils.context_managers.capture_duration                      import capture_duration

ROUTES_PATHS__CONFIG = ['/config/status', '/config/version']

# todo: refactor this class to other classes since this is now a very large class with lots of responsibilities and long methods
class Routes__Chat(Fast_API_Routes):
    tag                     : str = 'chat'
    cbr_chats_storage_local: CBR__Chats_Storage__Local
    cbr_chats_storage_s3   : CBR__Chats_Storage__S3

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
            request_headers = {key: value for key, value in request.headers.items()}
            log_llm_chat(llm_chat_completion, complete_answer, request_headers)
            llm_chat_completion.llm_answer = complete_answer
            self.cbr_chats_storage_local.chat_save(llm_chat_completion, request_id)
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
            request_headers = {key: value for key, value in request.headers.items()}
            log_llm_chat(llm_chat_completion, complete_answer, request_headers)
            llm_chat_completion.llm_answer = complete_answer

            self.cbr_chats_storage_s3.save_user_response(llm_chat_completion, request_id)
            #self.cbr_chats_storage_local.chat_save(llm_chat_completion, request_id)

            # if hasattr(request.state, "http_events"):                                 # todo: see if this is still needed (originaly this handled the case when the trace_calls did not handled ok the streamed responses
            #     http_events : Fast_API__Http_Events = request.state.http_events
            #     http_events.on_response_stream_completed(request)             # todo: rewrite this
            #print(f">>>>>>>>>>>>>>> STREAM COMPLETED: {request.state._state}")
        except Exception as error:
            print(f"[error][handle_other_llms__streamer] : {error}")        # todo: log this error
            traceback.print_exc()


    async def completion(self, llm_chat_completion: LLMs__Chat_Completion, request: Request):
        request_id       = self.request_id(request)
        chat_save_result = self.cbr_chats_storage_s3.save_user_request(llm_chat_completion, request_id)
        routes_open_ai   = Routes__OpenAI()
        user_data        = llm_chat_completion.user_data

        # for now use the code in routes_open_ai.prompt_with_system__stream which is already working for OpenAI
        if user_data and 'selected_platform' in user_data and user_data.get('selected_platform') != 'OpenAI (Paid)':
            response = await self.handle_other_llms(llm_chat_completion, request, request_id)
            if type(response) == StreamingResponse:
                response.headers.append('cbr__chat_id'       , chat_save_result.get('public_chat_id'        ,''))
                response.headers.append('cbr__chat_thread_id', chat_save_result.get('public_chat_thread__id',''))
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

    def setup_routes(self):
        self.router.post("/completion")(self.completion )
