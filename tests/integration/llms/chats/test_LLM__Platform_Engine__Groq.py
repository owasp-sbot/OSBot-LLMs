from unittest                                           import TestCase
from osbot_utils.utils.Env                              import load_dotenv
from osbot_llms.llms.chats.LLM__Platform_Engine__Groq   import LLM__Platform_Engine__Groq
from osbot_llms.models.LLMs__Chat_Completion            import LLMs__Chat_Completion


#@pytest.mark.skip("needs access to Groq")
class test_LLM__Platform_Engine__Groq(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        load_dotenv()
        cls.llm_platform           = 'Groq (Free)'
        cls.llm_provider           = 'Meta'
        cls.llm_model              = 'llama3-8b-8192'
        cls.user_prompt            = '51-9'
        cls.llm_chat_completion    = LLMs__Chat_Completion(user_prompt=cls.user_prompt)
        cls.kwargs                 = dict(llm_platform=cls.llm_platform, llm_provider=cls.llm_provider, llm_model=cls.llm_model, llm_chat_completion=cls.llm_chat_completion)
        cls.llm_engine_groq         = LLM__Platform_Engine__Groq(**cls.kwargs)

    def test_execute_request(self):
        response = self.llm_engine_groq.execute_request()
        assert '42' in list(response)