from unittest                                                           import TestCase
from fastapi                                                            import Request
from starlette.datastructures                                           import Address
from starlette.responses                                                import StreamingResponse
from osbot_utils.utils.Threads                                          import invoke_async_function
from osbot_llms.fast_api.routes.Routes__Chat                            import Routes__Chat
from osbot_llms.models.LLMs__Chat_Completion                            import LLMs__Chat_Completion


class test__int__Routes__Chat(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.routes_chat = Routes__Chat()

    def setUp(self) -> None:
        self.path                = '/an-path'
        self.client              = Address('pytest', 123)
        self.llm_platform        = "Groq (Free)"
        self.llm_provider        = "1. Meta"
        self.llm_model           = "llama3-70b-8192"
        self.user_prompt         = '50-8'
        self.system_prompts      = []
        self.stream              = False
        self.chat_kwargs         = dict(llm_platform   = self.llm_platform  , llm_provider = self.llm_provider, llm_model = self.llm_model,
                                        system_prompts = self.system_prompts, user_prompt  = self.user_prompt , stream    = self.stream   )
        self.llm_chat_completion = LLMs__Chat_Completion(**self.chat_kwargs)
        self.scope               = dict(type='http', client=self.client, path=self.path, method='GET', headers=[], query_string=b'')
        self.request             = Request(self.scope)

    async def collect_body_iterator(self, body_iterator):
        return [chunk async for chunk in body_iterator]

    def test_execute_llm_request(self):
        with self.routes_chat as _:
            response = self.routes_chat.execute_llm_request(self.llm_chat_completion)
            assert type(response) is str
            assert '42' in response

            self.llm_chat_completion.llm_platform = 'invalid-model'
            assert self.routes_chat.execute_llm_request(self.llm_chat_completion) == 'no engine'

    def test_handle_other_llms__groq(self):
        # no Stream
        request_id    = None
        response_str  = invoke_async_function(self.routes_chat.handle_other_llms(self.llm_chat_completion, self.request, request_id))
        assert type(response_str)              is str
        assert '42'                            in response_str.strip()
        assert self.llm_chat_completion.stream == False

        # with Stream
        self.llm_chat_completion.stream = True
        streaming_response = invoke_async_function(self.routes_chat.handle_other_llms(self.llm_chat_completion, self.request, request_id))

        assert type(streaming_response) is StreamingResponse
        items = invoke_async_function(self.collect_body_iterator(streaming_response.body_iterator))
        assert '42\n' in items

    def test_completion(self):
        self.llm_chat_completion.stream = True
        streaming_response              = invoke_async_function(self.routes_chat.completion(self.llm_chat_completion, self.request))
        items                           = invoke_async_function(self.collect_body_iterator(streaming_response.body_iterator))
        answer                          = ''.join(items)

        assert streaming_response.status_code == 200
        assert type(streaming_response)       == StreamingResponse
        assert '42'                           in answer

        self.llm_chat_completion.stream = False
        response_str                    = invoke_async_function(self.routes_chat.completion(self.llm_chat_completion, self.request))
        assert type(response_str) is str
        assert '42' in response_str

    def test_completion__openai(self):
        user_data = dict(selected_platform = 'Groq (Free)'     ,
                         selected_provider = '1. Meta'         ,
                         selected_model    = 'llama3-70b-8192')
        self.llm_chat_completion.llm_platform = None
        self.llm_chat_completion.llm_provider = None
        self.llm_chat_completion.llm_model    = None
        self.llm_chat_completion.user_data    = user_data
        self.llm_chat_completion.stream       = True
        streaming_response                    = invoke_async_function(self.routes_chat.completion(self.llm_chat_completion, self.request))
        items                                 = invoke_async_function(self.collect_body_iterator(streaming_response.body_iterator))
        answer                                = ''.join(items)

        assert streaming_response.status_code == 200
        assert type(streaming_response)       == StreamingResponse
        assert '42'                           in answer
