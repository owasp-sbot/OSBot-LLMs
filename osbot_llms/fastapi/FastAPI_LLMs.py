import uvicorn
from fastapi import FastAPI

from osbot_llms.fastapi.FastAPI_Utils import fastapi_routes
from osbot_llms.fastapi.open_ai.Router_Open_AI import Router_Open_AI
from osbot_utils.utils.Misc import list_set

from osbot_utils.decorators.lists.index_by import index_by
from starlette.routing import Route

from osbot_utils.decorators.methods.cache_on_self import cache_on_self



class FastAPI_LLMs:

    @cache_on_self
    def app(self):
        return FastAPI()

    @index_by
    def routes(self, include_default=False):
        return fastapi_routes(self.app(),include_default=include_default)

    def routes_paths(self):
        return list_set(self.routes(index_by='http_path'))

    def setup(self):
        self.setup_routes()
        return self

    def setup_routes(self):
        Router_Open_AI(self.app())
        return self

    def run_in_lambda(self):
        lambda_host = '127.0.0.1' #'127.0.0.1'
        lambda_port = 8080
        self.setup()
        kwargs = dict(app  =  self.app(),
                      host = lambda_host,
                      port = lambda_port)
        uvicorn.run(**kwargs)
