from unittest import TestCase

from osbot_llms.apis.open_ai.API_Open_AI import API_Open_AI
from osbot_llms.apis.open_ai.Mock_API_Open_AI import Mock_API_Open_AI
from osbot_utils.utils.Dev import pprint


class test_API_Open_AI(TestCase):

    def setUp(self) -> None:
        #self.api_open_ai = API_Open_AI()
        self.api_open_ai = Mock_API_Open_AI()

    def test_api_key(self):
        assert self.api_open_ai.api_key is not None

    def test_messages(self):
        assert self.api_open_ai.messages() == [{"role": "user", "content": 'Hi'}]

    def test_create(self):
        #messages = self.api_open_ai.messages()
        question = 'what is version of ChatGPT are you?'
        messages = [{"role": "user", "content": question}]
        response = self.api_open_ai.create(messages)
        print(response)
        for item in response:
            print(item)

    def test_ask_one_question_no_history(self):
        question = '2+2 , only reply with the answer'
        answer = self.api_open_ai.ask_one_question_no_history(question)
        assert answer == '4'