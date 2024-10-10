from unittest import TestCase
from osbot_llms.apis.open_ai.Mock_API_Open_AI import Mock_API_Open_AI, HARD_CODED_MESSAGES


class test_Mock_API_Open_AI(TestCase):

    def setUp(self):
        self.mock_api_open_ai = Mock_API_Open_AI()

    def test___setup_mocked_content(self):
        assert len(self.mock_api_open_ai.mocked_content) == 4

    def test__get_hard_coded_content_from_messages(self):

        def assert_messages_match(question, answer):
            messages =[{'content': question, 'role': 'user'}]
            assert self.mock_api_open_ai._Mock_API_Open_AI__get_hard_coded_content_from_messages(messages) == answer


        assert_messages_match('Hi'                                     , 'Hello there, this is the Mocked ChatGPT model')
        assert_messages_match('answer 40+2, reply with just the answer', '42'                                           )
        assert_messages_match('2+2 , only reply with the answer'       ,'4'                                             )


