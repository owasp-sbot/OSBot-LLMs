from functools import wraps

from osbot_utils.utils.Dev import pprint

from osbot_llms.apis.open_ai.API_Open_AI import API_Open_AI


HARD_CODED_MESSAGES = [{"messages": [{'content': 'answer 40+2, reply with just the answer', 'role': 'user'}] ,
                        "content" :  "42"                                                                   },
                       {"messages": [{'content': 'Hi', 'role': 'user'}] ,
                        "content" : "Hello there, this is the Mocked ChatGPT model"}]
MESSAGE_CONTENT_PAIRS = [('2+2 , only reply with the answer'        , '4'),
                         ('what is 40+2, reply with only the answer', '42')]

def mock_api_open_ai(func):
    @wraps(func)                                        # This is used to maintain the metadata of the wrapped function.
    def wrapper(instance, method):
        result               = func(instance, method)
        for attr_name, attr_value in vars(instance).items():                # Iterate over all attributes of the instance
            if isinstance(attr_value, API_Open_AI):                         # Check if the attribute value is an instance of API_Open_AI
                setattr(instance, attr_name, Mock_API_Open_AI())            # Replace it with a Mock_API_Open_AI instance
            for child_attr_name, child_attr_value in vars(attr_value).items():      # do the same thing for every child attribute of instance attributes
                if isinstance(child_attr_value, API_Open_AI):
                    setattr(child_attr_value, child_attr_name, Mock_API_Open_AI())
        instance.router.api_open_ai = Mock_API_Open_AI()
        return result
    return wrapper

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