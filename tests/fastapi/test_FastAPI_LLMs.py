from unittest import TestCase

import pytest
from fastapi import FastAPI

from osbot_llms.fastapi.FastAPI_Utils import FAST_API_DEFAULT_ROUTES
from osbot_llms.fastapi.open_ai.Router_Open_AI import Router_Open_AI
from osbot_utils.utils.Misc import obj_info, url_encode
from osbot_utils.utils.Dev import pprint, jprint
from osbot_llms.fastapi.FastAPI_LLMs import FastAPI_LLMs
from fastapi.testclient import TestClient

class test_FastAPI_LLMs(TestCase):

    def setUp(self):
        self.fastapi_llms = FastAPI_LLMs().setup()
        

    def test_app(self):
        app = self.fastapi_llms.app()
        assert type(app) == FastAPI

        assert app.openapi_version      == '3.1.0'
        assert app.debug                is False
        assert app.docs_url             == '/docs'
        assert app.dependency_overrides == {}
        assert app.openapi_url          == '/openapi.json'
        assert app.title                == 'FastAPI'
        assert app.version              == '0.1.0'

    def test_routes(self):
        expected_routes = FAST_API_DEFAULT_ROUTES + Router_Open_AI().routes(include_prefix=True)
        routes          = self.fastapi_llms.routes(include_default=True)
        assert routes == expected_routes

        #pprint(self.fastapi_llms.routes_paths())
        #pprint(self.fastapi_llms.app().routes)

    def test_prompt_simple(self):
        user_prompt     = url_encode('what is 40+2, reply with only the answer')
        expected_answer = {"model":None,"answer":"42"}
        expected_status = 200
        model           = 'gpt-3.5-turbo'
        app = FastAPI_LLMs().setup().app()
        client = TestClient(app)

        response = client.post(f"/open_ai/prompt_simple?model={model}&user_prompt={user_prompt}")

        assert response.status_code == expected_status
        assert response.json()      == expected_answer



