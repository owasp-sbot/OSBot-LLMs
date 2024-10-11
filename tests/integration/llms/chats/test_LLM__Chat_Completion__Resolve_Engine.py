from decimal                                                    import Decimal
from unittest                                                   import TestCase
from osbot_llms.llms.chats.LLM__Chat_Completion__Resolve_Engine import LLM__Chat_Completion__Resolve_Engine
from osbot_llms.llms.providers.mistral.LLM__Mistral             import LLM_BASE_URL__MISTRAL, MISTRAL__DEFAULT_MODEL, LLM_PLATFORM_NAME
from osbot_llms.models.LLMs__Chat_Completion                    import LLMs__Chat_Completion


class test_LLM__Chat_Completion__Resolve_Engine(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.llm_resolve_engine = LLM__Chat_Completion__Resolve_Engine()

    def test_map_provider(self):
        kwargs = dict(user_data = dict(selected_platform = "Ollama (Local)",
                                       selected_provider = "Microsoft"     ,
                                       selected_model    = "phi3"          ))

        llm_chat_completion = LLMs__Chat_Completion(**kwargs)
        response = self.llm_resolve_engine.map_provider(llm_chat_completion)
        assert response.json() == { 'llm_chat_completion': { 'chat_thread_id': '',
                                                             'histories': None,
                                                             'images': [],
                                                             'llm_answer': None,
                                                             'llm_model': None,
                                                             'llm_platform': None,
                                                             'llm_provider': None,
                                                             'max_tokens': None,
                                                             'seed': 42,
                                                             'stream': True,
                                                             'system_prompts': None,
                                                             'temperature': 0.0,
                                                             'user_data': { 'selected_model': 'phi3',
                                                                            'selected_platform': 'Ollama (Local)',
                                                                            'selected_provider': 'Microsoft'},
                                                             'user_prompt': 'Hi'},
                                      'llm_model'        : 'phi3',
                                      'llm_platform'     : 'Ollama (Local)',
                                      'llm_provider'     : 'Microsoft'}

    def test_map_provider__mistral(self):
        kwargs = dict(user_data=dict(selected_platform = "Mistral (Free)",
                                     selected_provider = "Mistral",
                                     selected_model    = "pixtral-12b-2409"))

        llm_chat_completion = LLMs__Chat_Completion(**kwargs)
        response = self.llm_resolve_engine.map_provider(llm_chat_completion)

        assert response.llm__mistral.base_url == LLM_BASE_URL__MISTRAL
        assert response.llm__mistral.model    == MISTRAL__DEFAULT_MODEL
        assert response.llm_platform          == LLM_PLATFORM_NAME
        assert response.llm_model             == MISTRAL__DEFAULT_MODEL

        #assert response.llm_chat_completion.llm_platform == 'asd'
