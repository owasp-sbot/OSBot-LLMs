from unittest                                            import TestCase
from osbot_utils.utils.Env                               import load_dotenv
from osbot_llms.llms.chats.LLM__Platform_Engine__Mistral import LLM__Platform_Engine__Mistral
from osbot_llms.llms.providers.mistral.LLM__Mistral      import MISTRAL__DEFAULT_MODEL
from osbot_llms.models.LLMs__Chat_Completion             import LLMs__Chat_Completion


class test_LLM__Platform_Engine__Mistral(TestCase):

    @classmethod
    def setUpClass(cls):
        load_dotenv()
        cls.llm_platform           = 'Mistral (Free)'
        cls.llm_provider           = 'Mistral'
        cls.llm_model              = MISTRAL__DEFAULT_MODEL
        cls.system_prompt          = 'just reply with the answer in one word'
        cls.user_prompt            = '1+2'
        cls.llm_chat_completion    = LLMs__Chat_Completion(user_prompt=cls.user_prompt, system_prompt=cls.system_prompt)
        cls.kwargs                 = dict(llm_platform=cls.llm_platform, llm_provider=cls.llm_provider, llm_model=cls.llm_model, llm_chat_completion=cls.llm_chat_completion)
        cls.llm_engine_groq        = LLM__Platform_Engine__Mistral(**cls.kwargs)

    def test_execute_request(self):
        response = self.llm_engine_groq.execute_request()
        assert '3' in list(response)
