from fastapi import APIRouter

from osbot_utils.base_classes.Kwargs_To_Self import Kwargs_To_Self


class Fast_API__Routes(Kwargs_To_Self):
    router      : APIRouter
    path_prefix : str

    def add_routes(self):
        pass

    def setup(self, app):
        prefix = f'/{self.path_prefix}'
        tags   = [self.path_prefix]
        self.add_routes()
        app.include_router(self.router, prefix=prefix, tags=tags)