from unittest import TestCase

from osbot_utils.testing.Duration import Duration

from osbot_llms.apis.open_ai.API_Open_AI import API_Open_AI
from osbot_llms.apis.open_ai.Mock_API_Open_AI import Mock_API_Open_AI, mock_api_open_ai
from osbot_utils.utils.Dev import pprint


class test_API_Open_AI(TestCase):

    #@mock_api_open_ai
    def setUp(self) -> None:
        self.api_open_ai = API_Open_AI()
        #self.api_open_ai = Mock_API_Open_AI()

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

    def test_create__with_images(self):
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What’s in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://open-security-summit.org/img/logo.png",
                        },
                    },
                ],
            },
        ]
        self.api_open_ai.model = 'gpt-4-vision-preview'
        result = self.api_open_ai.create(messages)
        answer = ""
        for chunck in result:
            if chunck:
                answer += chunck
        assert 'OPEN SECURITY SUMMIT' in answer

    def test_ask_one_question_no_history(self):
        question = '2+2 , only reply with the answer'
        answer = self.api_open_ai.ask_one_question_no_history(question)
        assert answer == '4'

    def test_ask_one_question_no_history__async_mode(self):
        question  = 'count to 10, only reply with the numbers, without any spaces or commands, like this 12'
        generator = self.api_open_ai.ask_one_question_no_history(question, async_mode=True)
        answers = []
        for answer in generator:
            answers.append(answer)
        assert answers == ['', '123', '456', '789', '10', None]

    def test_ask_using_system_prompts(self):
        user_prompt_1 = '40+2 , only reply with the answer'
        answer_1 = self.api_open_ai.ask_using_system_prompts(user_prompt=user_prompt_1)
        assert answer_1 == '42'

        kwargs = { "model"       :  'gpt-4-vision-preview'                      ,
                   "user_prompt" : [ { "type"      : "text"                     ,
                                       "text"      : "What’s in this image?"}   ,
                                      { "type"     : "image_url"                ,
                                        "image_url": { "url": "https://open-security-summit.org/img/logo.png", },
                                      }]}
        answer_2 = self.api_open_ai.ask_using_system_prompts(**kwargs)
        assert 'OPEN SECURITY SUMMIT' in answer_2

    def test__multiple_models(self):
        def invoke_model(model):
            with Duration(prefix=f'model: {model} took'):
            #print(f"testing model: {model}")
                api_open_ai = API_Open_AI()
                api_open_ai.model = model
                question = '2+2 only reply with the answer'
                answer = api_open_ai.ask_one_question_no_history(question)
                assert answer == '4'
        print()
        models = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4',
                  'gpt-4-1106-preview', 'gpt-4-vision-preview']
        #models = ['gpt-4-32k', 'gpt-4-32k-0613'] # DC in 6 Nov 2023, I'm getting the error: "does not exist or you do not have access to it"
        # 'gpt-4-vision-preview'] # todo: add support for images
        for model in models:
            invoke_model(model)


