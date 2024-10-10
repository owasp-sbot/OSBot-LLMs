from cbr_athena.athena__fastapi.llms.routes.Routes__Chat import Routes__Chat
from osbot_fast_api.api.Fast_API import Fast_API


class LLMs__Fast_API(Fast_API):
    base_path : str  = '/llms'

    def setup_routes(self):
        self.add_routes(Routes__Chat)
