from unittest import TestCase

import pytest
import requests
from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Env import get_env
from osbot_utils.utils.Objects import dict_to_obj, base_types

from osbot_llms.models.LLMs__Chat_Completion import LLMs__Chat_Completion

ENV_NAME__URL_LIVE_SERVER = 'URL_LIVE_SERVER'
DEFAULT_URL_LIVE_SERVER   = 'http://localhost:5010'

@pytest.mark.skip("Wire up to CI pipline")
class test_Live_Server(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.live_server = get_env(ENV_NAME__URL_LIVE_SERVER, DEFAULT_URL_LIVE_SERVER)

    def test_server_connection(self):
        response = requests.get(self.live_server, allow_redirects=False)
        assert response.status_code == 307
        assert dict_to_obj(dict(response.headers)).location == '/docs'

    def test_open_api(self):
        response = dict_to_obj(requests.get(self.live_server+'/openapi.json').json())
        assert response.info.title                      == 'FastAPI'
        assert getattr(response.paths, '/').get.summary == 'Redirect To Docs'

    def test__chat__completion(self):
        llms_chat_completion = LLMs__Chat_Completion(stream=True)
        response = requests.post(self.live_server + '/chat/completion', json=llms_chat_completion.json())
        #assert response.text == '"no engine"'
        assert response.text == 'n\no\n \ne\nn\ng\ni\nn\ne\n'
