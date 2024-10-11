from osbot_utils.base_classes.Type_Safe import Type_Safe
from osbot_fast_api.api.Fast_API_Routes import Fast_API_Routes

from osbot_llms.utils.Version           import version__osbot_llms
from dataclasses                        import dataclass

class Routes__Info(Fast_API_Routes):
    tag : str = 'info'

    def version(self):
        return {"version" : version__osbot_llms }

    def setup_routes(self):
        self.add_route_get(self.version)