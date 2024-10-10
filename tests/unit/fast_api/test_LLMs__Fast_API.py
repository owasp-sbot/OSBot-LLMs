from unittest import TestCase

from osbot_llms.fast_api.LLMs__Fast_API import LLMs__Fast_API


class test_LLMs__Fast_API(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.llms__fast_api = LLMs__Fast_API()

    def test__setUpClass(self):
        with self.llms__fast_api as _:
            assert type(_) is LLMs__Fast_API

