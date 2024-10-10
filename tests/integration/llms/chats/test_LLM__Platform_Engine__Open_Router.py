from unittest                                                   import TestCase
from osbot_utils.utils.Env                                      import load_dotenv
from osbot_llms.llms.chats.LLM__Platform_Engine__Open_Router    import LLM__Platform_Engine__Open_Router
from osbot_llms.models.LLMs__Chat_Completion                    import LLMs__Chat_Completion

class test_LLM__Platform_Engine__Open_Router(TestCase):
    @classmethod
    def setUpClass(cls):
        load_dotenv()
        cls.llm_platform           = "Open Router (Free)"
        cls.llm_provider           = "LLaMA3 8b"
        cls.llm_model              = "meta-llama/llama-3-8b-instruct:free"
        cls.user_prompt            = "1+2"
        cls.llm_chat_completion    = LLMs__Chat_Completion(user_prompt=cls.user_prompt)
        cls.kwargs                 = dict(llm_platform=cls.llm_platform, llm_provider=cls.llm_provider, llm_model=cls.llm_model, llm_chat_completion=cls.llm_chat_completion)
        cls.llm_engine_open_router = LLM__Platform_Engine__Open_Router(**cls.kwargs)

    def test_execute_request(self):
        response = self.llm_engine_open_router.execute_request()
        assert '3' in list(response)