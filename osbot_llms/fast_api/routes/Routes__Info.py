from osbot_fast_api.api.Fast_API_Routes import Fast_API_Routes

from osbot_llms.utils.Version import version__osbot_llms


class Routes__Info(Fast_API_Routes):
    tag : str = 'info'

    def version(self):
        return {"version" : version__osbot_llms }

    def ping(self):
        return {"it_is" : "pong" }

    def setup_routes(self):
        self.add_route_get(self.version)
        self.add_route_get(self.ping   )