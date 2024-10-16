from unittest                                 import TestCase
from osbot_llms.llms.providers.groq.LLM__Groq import LLM__Groq, LLM_BASE_URL__GROQ
from osbot_utils.utils.Env import load_dotenv


class test_LLM__Groq(TestCase):

    def setUp(self):
        load_dotenv()
        self.llm_groq = LLM__Groq()

    def test__init__(self):
        with self.llm_groq as _:
            assert type(_) is LLM__Groq
            assert _.base_url    == LLM_BASE_URL__GROQ

