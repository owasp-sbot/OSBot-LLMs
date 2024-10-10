from osbot_llms.Config import Config
from osbot_llms.fastapi.FastAPI_Route import FastAPI_Router


class Router_Status(FastAPI_Router):

    def __init__(self, app=None):
        super().__init__(app, name='status')
        self.setup_routes()
        super().setup()

    def status(self):
        return 'ok'

    def version(self):
        return Config().version()

    def setup_routes(self):
        self.router.get("/status" )(self.status)
        self.router.get("/version")(self.status)


