from osbot_utils.utils.Dev import pprint

from osbot_llms.apis.open_ai.API_Open_AI import API_Open_AI


HARD_CODED_MESSAGES = [{"messages": [{'content': 'answer 40+2, reply with just the answer', 'role': 'user'}] ,
                        "content" :  "42"                                                                   },
                       {"messages": [{'content': 'Hi', 'role': 'user'}] ,
                        "content" : "Hello there, this is the Mocked ChatGPT model"}]
MESSAGE_CONTENT_PAIRS = [('2+2 , only reply with the answer'        , '4'),
                         ('what is 40+2, reply with only the answer', '42')]

class Mock_API_Open_AI(API_Open_AI):

    def __init__(self):
        super().__init__()
        self.mocked_content = list(HARD_CODED_MESSAGES)
        self.__setup_mocked_content()

    def __get_hard_coded_content_from_messages(self, messages):
        for entry in self.mocked_content:
            if entry.get('messages') == messages:
                return entry.get('content')
        return '...mocked content for message: {}'.format(messages)

    def __setup_mocked_content(self):
        for (question, answer) in MESSAGE_CONTENT_PAIRS:
            item = {"messages": [{'content':question , 'role': 'user'}] ,
                    "content": answer}
            self.mocked_content.append(item)

    def api_key(self):
        return "mock_api_key"

    def create(self, messages, model=None):
        #pprint(messages)
        content = self.__get_hard_coded_content_from_messages(messages)
        mocked_response = [
            {
                'choices': [
                    {
                        'delta': {
                            'content': content
                        }
                    }
                ]
            }
        ]
        return self.parse_response(mocked_response)

    def setup(self):
        # No actual setup needed for the mock.
        return self