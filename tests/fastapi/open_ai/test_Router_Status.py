from unittest import TestCase

from osbot_llms.Config import Config
from osbot_llms.fastapi.open_ai.Router_Status import Router_Status


class test_Router_Status(TestCase):


    def setUp(self) -> None:
        self.router_status = Router_Status()


    def test_routes(self):
        assert self.router_status.routes_paths() == ['/status', '/version']

    def test_status(self):
        assert self.router_status.status() == 'ok'

    def test_version(self):
        assert self.router_status.version() == Config().version()

