from os import getenv
from unittest import TestCase

import pytest
from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Env import load_dotenv
from osbot_utils.utils.Misc                                         import list_set
from osbot_utils.utils.Objects import dict_to_obj

from osbot_llms.llms.providers.mistral.LLM__Mistral import LLM__Mistral, ENV_NAME__MISTRAL_API_KEY, \
    LLM_BASE_URL__MISTRAL, MISTRAL__DEFAULT_MODEL


#@pytest.mark.skip("needs refactoring to new @flow/@task driven approach")
class test_LLM_Mistral(TestCase):


    @classmethod
    def setUpClass(cls):
        load_dotenv()
        cls.llm_mistral = LLM__Mistral()

    def test__init__(self):
        with self.llm_mistral  as _:
            assert _.__locals__() == {'api_key'  : getenv(ENV_NAME__MISTRAL_API_KEY) ,
                                      'base_url' : LLM_BASE_URL__MISTRAL              ,
                                      'messages' : []                                 ,
                                      'model'    : MISTRAL__DEFAULT_MODEL             ,
                                      'stream'   : True    }

            assert _.api_key is not None

    @pytest.mark.skip("was failing in GH Actions")
    def test_send_user_prompt(self):
        user_prompt = "2+2"
        self.llm_mistral.add_message__system('reply in one word only')
        response = self.llm_mistral.send_user_prompt(user_prompt=user_prompt)
        assert list_set(response) == ['choices', 'created', 'id', 'model', 'object', 'usage']
        assert '4' in dict_to_obj(response).choices[0].message.content
