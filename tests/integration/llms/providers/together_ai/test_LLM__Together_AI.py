import pytest
from unittest               import TestCase

from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Env  import load_dotenv, get_env
from osbot_utils.utils.Misc import list_set
from osbot_utils.utils.Objects import dict_to_obj

from osbot_llms.llms.providers.together_ai.LLM__Together_AI import LLM__Together_AI, TOGETHER_AI__LLM_BASE_URL, \
    TOGETHER_AI__DEFAULT_MODEL


#@pytest.mark.skip("needs refactoring to new @flow/@task driven approach")
class test_LLM__Together_AI(TestCase):

    llm_together_ai : LLM__Together_AI

    @classmethod
    def setUpClass(cls):
        load_dotenv()
        super().setUpClass()
        cls.llm_together_ai = LLM__Together_AI()

    def test__init__(self):
        with self.llm_together_ai  as _:
            assert _.__locals__() == {'api_key' :  get_env("TOGETHER_AI_API_KEY") ,
                                      'base_url': TOGETHER_AI__LLM_BASE_URL       ,
                                      'messages': []                              ,
                                      'model'   : TOGETHER_AI__DEFAULT_MODEL      ,
                                      'stream'  : True                            }

            assert _.api_key is not None

    @pytest.mark.skip("was hanging in GH Actions")
    def test_send_user_prompt(self):
        user_prompt = "2+2"
        self.llm_together_ai.add_message__system('reply in one word only')
        response = self.llm_together_ai.send_user_prompt(user_prompt=user_prompt)
        assert list_set(response) == ['choices', 'created', 'id', 'model', 'object', 'prompt', 'usage']
        assert dict_to_obj(response).choices[0].text == 'Four'