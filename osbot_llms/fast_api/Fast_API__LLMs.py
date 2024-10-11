
from osbot_fast_api.api.Fast_API            import Fast_API
from osbot_llms.fast_api.routes.Routes__Chat import Routes__Chat
from osbot_llms.fast_api.routes.Routes__Info import Routes__Info


class Fast_API__LLMs(Fast_API):
    base_path  : str  = '/llms'
    enable_cors: bool = True

    def setup_routes(self):
        self.add_routes(Routes__Chat)
        self.add_routes(Routes__Info)


