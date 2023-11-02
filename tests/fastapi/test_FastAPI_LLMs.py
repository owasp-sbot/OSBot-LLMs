from unittest import TestCase

import pytest
import requests
from fastapi import FastAPI, APIRouter

from osbot_llms.fastapi.FastAPI_Utils import FAST_API_DEFAULT_ROUTES, FAST_API_LLMS_DEFAULT_ROUTES
from osbot_llms.fastapi.open_ai.Router_Open_AI import Router_Open_AI
from osbot_utils.utils.Misc import obj_info, url_encode
from osbot_utils.utils.Dev import pprint, jprint
from osbot_llms.fastapi.FastAPI_LLMs import FastAPI_LLMs
from fastapi.testclient import TestClient

class test_FastAPI_LLMs(TestCase):

    def setUp(self):
        self.fastapi_llms = FastAPI_LLMs().setup()
        app               = self.fastapi_llms.app()
        self.test_client  = TestClient(app)
        

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
        expected_routes = FAST_API_DEFAULT_ROUTES         + \
                          FAST_API_LLMS_DEFAULT_ROUTES    + \
                          Router_Open_AI().routes(include_prefix=True)
        routes          = self.fastapi_llms.routes(include_default=True)
        assert routes == expected_routes

        #pprint(self.fastapi_llms.routes_paths())
        #pprint(self.fastapi_llms.app().routes)

    def test_router(self):
        router = self.fastapi_llms.router()
        assert type(router) == APIRouter

    def test_redirect_to_docs(self):
        response = self.test_client.get('/', follow_redirects=False)
        assert response.status_code == 307
        assert response.headers.get('location') == '/docs'

    def test_prompt_simple(self):
        user_prompt     = url_encode('what is 40+2, reply with only the answer')
        expected_answer = {"model":None,"answer":"42"}
        expected_status = 200
        model           = 'gpt-3.5-turbo'
        path            = f"/open_ai/prompt_simple?model={model}&user_prompt={user_prompt}"
        response        = self.test_client.post(path)

        assert response.status_code == expected_status
        assert response.json()      == expected_answer

    def test_prompt_with_system(self):
        system_prompts = [ 'act like a counter, only reply with the numbers, without any spaces or commands, like this 12']
        question = 'count to 10'
        data = { 'model'         : 'gpt-3.5-turbo',
                 'user_prompt'   : question       ,
                 'system_prompts': system_prompts }

        pprint(data)

        response = self.test_client.post("/open_ai/prompt_with_system", json=data)
        assert response.status_code == 200
        assert response.json()      == {"model":None,"answer":"12345678910"}

    def test_prompt_with_system__stream(self):
        system_prompts = [ 'act like a counter, only reply with the numbers, without any spaces or commands, like this 12']
        question = 'count to 10'
        data = { 'model'         : 'gpt-3.5-turbo',
                 'user_prompt'   : question       ,
                 'system_prompts': system_prompts }

        pprint(data)

        url = "http://localhost:8000" + "/open_ai/prompt_with_system__stream"
        #response = self.test_client.post("/open_ai/prompt_with_system__stream", json=data, stream=True)
        response = requests.post(url, json=data, stream=True)
        assert response.status_code == 200
        pprint(dict(response.headers))
        streamed_responses = []

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                streamed_responses.append(decoded_line)

        assert streamed_responses == ['123', '456', '789', '10']
        #assert response.json()      == {"model":None,"answer":"12345678910"}


    # def test_prompt_with_system__stream(self):
    #     system_prompts     = ['act like a counter, only reply with the numbers, without any spaces or commands, like this 12']
    #     question           = 'count to 10'



