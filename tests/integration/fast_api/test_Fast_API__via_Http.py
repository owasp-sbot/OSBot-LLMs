from unittest                                       import TestCase
from fastapi                                        import FastAPI
from osbot_fast_api.utils.Fast_API_Server           import Fast_API_Server
from osbot_utils.context_managers.print_duration    import print_duration
from osbot_utils.testing.Stdout import Stdout
from osbot_utils.utils.Dev import pprint

from osbot_llms.models.LLMs__Chat_Completion import LLMs__Chat_Completion
from osbot_llms.utils.Version                       import version__osbot_llms
from tests.llm_fast_api__for_tests                  import llm_fast_api, llm_fast_api__app


class test_Fast_API__via_Http(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        with print_duration():
            cls.llm_fast_api      = llm_fast_api
            cls.llm_fast_api__app = llm_fast_api__app
            cls.fast_api_server   = Fast_API_Server(app=cls.llm_fast_api__app)
            cls.fast_api_server.start()
            assert cls.fast_api_server.is_port_open() is True

    @classmethod
    def tearDownClass(cls) -> None:
        cls.fast_api_server.stop()
        assert cls.fast_api_server.is_port_open() is False

    def test__setUpClass(self):
        assert type(self.llm_fast_api__app) is FastAPI
        assert type(self.fast_api_server  ) is Fast_API_Server

    def test_version(self):
        with self.llm_fast_api as _:
            version__fast_api    = _.version__fast_api_server()
            assert self.fast_api_server.requests_get('/config/version').json() == {'version': version__fast_api   }
            assert self.fast_api_server.requests_get('/info/version'  ).json() == {'version': version__osbot_llms }

    def test__chat__completion(self):
        with self.llm_fast_api as _:
            llm_chat_completion = LLMs__Chat_Completion(user_prompt='51-9')
            response = self.fast_api_server.requests_post('/chat/completion', data=llm_chat_completion)
            assert '42' in response.text



