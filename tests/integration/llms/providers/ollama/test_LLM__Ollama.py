import pytest
from unittest                                     import TestCase
from osbot_utils.utils.Dev                        import pprint
from osbot_utils.utils.Json                       import from_json_str
from osbot_utils.utils.Misc                       import list_set
from osbot_llms.llms.providers.ollama.LLM__Ollama import LLM__Ollama, LLM__Models__OLLAMA, LLM_BASE_URL__OLLAMA


@pytest.mark.skip("needs access to ollama local server")
class test_LLM_Ollama(TestCase):

    llm_ollama : LLM__Ollama

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.llm_ollama = LLM__Ollama()

    def test__init__(self):
        with self.llm_ollama  as _:
            assert _.__locals__() == {'api_key' :  ''                           ,
                                      'base_url' : LLM_BASE_URL__OLLAMA         ,
                                      'messages' : []                           ,
                                      'model'    : LLM__Models__OLLAMA.GEMMA_2B }

    def test_api_generate(self):
        #prompt = "Why is the sky blue?, return in one paragraph"

        with self.llm_ollama as _:
            prompt  = "40+2"
            response = _.api_generate(prompt)
            assert 'context' in list_set(response)
            assert '42' in response.get('response')

        with self.llm_ollama as _:
            prompt  = "40+2,  Respond using JSON"
            response = _.api_generate(prompt, format='json')
            assert 'context' in list_set(response)

            data = from_json_str(response.get('response'))
            assert '42' in str(data.get('result'))

    # works ok: llava takes about 1 minute , bakllava takes about 40sec
    @pytest.mark.skip("take quite a but in CPU")
    def test_model_with_image_support(self):
        model_name = 'llava'            # both work
        base64_image_bytes = "..."      # to do, get this from an external source (i.e. not from the code)
        model_name = 'bakllava'
        with LLM__Ollama(model=model_name) as _:
            assert _.model == model_name
            path      = 'api/generate'
            json_data =  { "model": model_name,
                           "prompt":"What is in this picture?",
                           "stream": False,
                           "images": [base64_image_bytes] }
            response = _.post_request(path, json_data)
            pprint(response)

    def test_model_details(self):
        with self.llm_ollama as _:
            model_details = _.model_details(model_name=LLM__Models__OLLAMA.GEMMA_2B)
            assert list_set(model_details) == ['details', 'license', 'model_info', 'modelfile', 'modified_at', 'parameters', 'template']

    def test_models(self):
        with self.llm_ollama as _:
            models = _.models()
            for model in models:
                assert list_set(model) == ['details', 'digest', 'model', 'modified_at', 'name', 'size']

    def test_get_request(self):
        with self.llm_ollama as _:
            assert _.get_request() == 'Ollama is running'

    def test_send_user_prompt(self):
        user_prompt = "what is 40 + 2"
        self.llm_ollama.add_message__system('reply in one word only')
        response = self.llm_ollama.send_user_prompt(user_prompt=user_prompt)
        assert 'created_at' in list_set(response)
        # assert list_set(response) == ['created_at', 'done', 'done_reason', 'eval_count',
        #                               'eval_duration', 'load_duration', 'message', 'model',
        #                               'prompt_eval_duration', 'total_duration']
        assert '42' in response.get('message').get('content')