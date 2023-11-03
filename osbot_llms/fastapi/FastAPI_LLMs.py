import os

import uvicorn
from fastapi import FastAPI

import osbot_llms
from osbot_utils.utils.Files import path_combine
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

from osbot_llms.fastapi.FastAPI_Utils import fastapi_routes
from osbot_llms.fastapi.open_ai.Router_Open_AI import Router_Open_AI
from osbot_utils.utils.Misc import list_set

from osbot_utils.decorators.lists.index_by import index_by


from osbot_utils.decorators.methods.cache_on_self import cache_on_self



class FastAPI_LLMs:

    @cache_on_self
    def app(self):
        return FastAPI()

    def path_static_folder(self):
        return path_combine(osbot_llms.path, 'web_static')

    @index_by
    def routes(self, include_default=False):
        return fastapi_routes(self.app(),include_default=include_default)

    def router(self):
        return self.app().router

    def routes_paths(self):
        return list_set(self.routes(index_by='http_path'))

    def setup(self):
        self.setup_default_routes()
        # self.setup_middleware()        # todo: add support for only adding this when running in Localhost
        self.setup_static_routes()
        self.setup_routes()
        return self

    def setup_default_routes(self):
        self.router().get("/")(self.redirect_to_docs)

    def setup_middleware(self):
        # Configure CORS
        self.app().add_middleware(CORSMiddleware,
                                  allow_origins     = ["*"]                         ,
                                  allow_credentials = True                          ,
                                  allow_methods     = ["GET", "POST", "HEAD"]       ,
                                  allow_headers     = ["Content-Type", "X-Requested-With", "Origin", "Accept", "Authorization"],
                                  expose_headers    = ["Content-Type", "X-Requested-With", "Origin", "Accept", "Authorization"])
    def setup_static_routes(self):
        path_static        = "/static"
        path_static_folder = self.path_static_folder()
        path_name          = "static"
        self.app().mount(path_static, StaticFiles(directory=path_static_folder), name=path_name)

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

    # defaut routes
    async def redirect_to_docs(self):
        return RedirectResponse(url="/docs")
