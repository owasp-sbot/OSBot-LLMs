from unittest import TestCase

from osbot_llms.fast_api.Fast_API__LLMs import Fast_API__LLMs


class test_Fast_API__LLMs(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.llms__fast_api = Fast_API__LLMs()

    def test__setUpClass(self):
        with self.llms__fast_api as _:
            assert type(_) is Fast_API__LLMs

