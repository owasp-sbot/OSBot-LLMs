from unittest import TestCase

from osbot_llms.apis.open_ai.Open_AI_Cache import Open_AI_Cache
from osbot_utils.helpers.Local_Caches       import Local_Caches


class test_Open_AI_Cache(TestCase):

    def setUp(self):
        self.open_ai_cache = Open_AI_Cache()

    def test___init__(self):
        assert type(self.open_ai_cache.local_caches) is Local_Caches