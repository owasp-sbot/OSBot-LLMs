from unittest import TestCase

from osbot_llms.An_Class import An_Class


class test_An_Class(TestCase):

    def setUp(self):
        self.an_class = An_Class()

    def test_an_method(self):
        assert self.an_class.an_method() == {'answer': 42}

