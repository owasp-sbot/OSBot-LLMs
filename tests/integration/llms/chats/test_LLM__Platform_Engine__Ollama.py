from unittest import TestCase

import pytest

from osbot_llms.llms.chats.LLM__Platform_Engine__Ollama import LLM__Platform_Engine__Ollama
from osbot_llms.models.LLMs__Chat_Completion import LLMs__Chat_Completion


@pytest.mark.skip("needs locally ollama")
class test_LLM__Platform_Engine__Ollama(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.llm_platform        = "Ollama (Local)"
        cls.llm_provider        = "Microsoft"
        cls.llm_model           = "phi3"
        cls.llm_chat_completion = LLMs__Chat_Completion()
        cls.kwargs              = dict(llm_platform=cls.llm_platform, llm_provider=cls.llm_provider, llm_model=cls.llm_model, llm_chat_completion=cls.llm_chat_completion)
        cls.llm_engine_ollama   = LLM__Platform_Engine__Ollama(**cls.kwargs)

    def test_sync_execute_request(self):

        response = self.llm_engine_ollama.execute_request()
        for chunk in response:
            print(chunk)

