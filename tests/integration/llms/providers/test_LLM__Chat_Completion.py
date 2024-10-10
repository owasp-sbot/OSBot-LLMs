import typing
from os                                             import getenv
from unittest                                       import TestCase
from osbot_utils.utils.Env                          import load_dotenv
from osbot_utils.utils.Misc                         import list_set
from osbot_llms.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion, MAX_ANSWER_SIZE
from osbot_llms.llms.providers.groq.LLM__Groq       import ENV_NAME__GROQ_API_KEY


class test_LLM__Chat_Completion(TestCase):

    @classmethod
    def setUpClass(cls):
        load_dotenv()
        cls.base_url  = "https://api.example.com"
        cls.api_key   = "test_key"
        cls.model     = "gpt-3"
        cls.groq_data = dict(base_url = 'https://api.groq.com/openai/v1/chat/completions',
                             api_key  = getenv(ENV_NAME__GROQ_API_KEY)                   ,
                             model    = 'llama3-8b-8192'                                 )

    def setUp(self):
        self.messages  = []
        self.llm_chat_completion = LLM__Chat_Completion(base_url = self.base_url,
                                                        api_key  = self.api_key ,
                                                        model    = self.model   ,
                                                        messages = []           )

    def test__init__(self):
        assert LLM__Chat_Completion()  .__locals__() == { 'api_key': '',
                                                          'base_url': '',
                                                          'messages': [],
                                                          'model': '',
                                                          'stream': True}
        assert self.llm_chat_completion.__locals__() == { 'api_key': 'test_key',
                                                          'base_url': 'https://api.example.com',
                                                          'messages': [],
                                                          'model': 'gpt-3',
                                                          'stream': True}

    def test_add_message(self):
        # Test adding a single message
        self.llm_chat_completion.add_message("user", "Hello, how are you?")
        assert len(self.llm_chat_completion.messages) == 1
        assert self.llm_chat_completion.messages[0]['role'] == "user"
        assert self.llm_chat_completion.messages[0]['content'] == "Hello, how are you?"

    def test_add_message__system(self):
        # Test adding a system message
        self.llm_chat_completion.add_message__system("This is a system prompt")
        assert len(self.llm_chat_completion.messages) == 1
        assert self.llm_chat_completion.messages[0]['role'] == "system"
        assert self.llm_chat_completion.messages[0]['content'] == "This is a system prompt"

    def test_add_message__user(self):
        # Test adding a user message
        self.llm_chat_completion.add_message__user("User prompt here")
        assert len(self.llm_chat_completion.messages) == 1
        assert self.llm_chat_completion.messages[0]['role'] == "user"
        assert self.llm_chat_completion.messages[0]['content'] == "User prompt here"

    def test_add_messages__system(self):
        # Test adding multiple system messages
        system_prompts = ["System prompt 1", "System prompt 2"]
        self.llm_chat_completion.add_messages__system(system_prompts)
        assert len(self.llm_chat_completion.messages) == 2
        assert self.llm_chat_completion.messages[0]['role'] == "system"
        assert self.llm_chat_completion.messages[1]['role'] == "system"

    def test_add_messages__user(self):
        # Test adding multiple user messages
        user_prompts = ["User prompt 1", "User prompt 2"]
        self.llm_chat_completion.add_messages__user(user_prompts)
        assert len(self.llm_chat_completion.messages) == 2
        assert self.llm_chat_completion.messages[0]['role'] == "user"
        assert self.llm_chat_completion.messages[1]['role'] == "user"

    def test_add_histories(self):
        # Test adding histories with answer truncation

        histories = [
            Mock_History("What is AI?", "AI stands for Artificial Intelligence."),
            Mock_History("Explain deep learning.", "Deep learning is a subset of machine learning " + "a" * MAX_ANSWER_SIZE)
        ]

        self.llm_chat_completion.add_histories(histories)
        assert len(self.llm_chat_completion.messages) == 4  # 2 questions and 2 answers
        assert self.llm_chat_completion.messages[0]['role'] == 'user'
        assert self.llm_chat_completion.messages[1]['role'] == 'assistant'
        assert self.llm_chat_completion.messages[3]['content'][-3:] == '...'  # Truncated answer

    def test_add_histories_no_truncation(self):
        # Test histories where no truncation is needed
        histories = [
            Mock_History("What is AI?", "AI stands for Artificial Intelligence."),
            Mock_History("Explain machine learning.", "Machine learning is a subset of AI.")
        ]

        self.llm_chat_completion.add_histories(histories)
        assert len(self.llm_chat_completion.messages) == 4  # 2 questions and 2 answers
        assert self.llm_chat_completion.messages[1]['content'] == "AI stands for Artificial Intelligence."
        assert self.llm_chat_completion.messages[3]['content'] == "Machine learning is a subset of AI."

    def test_chat_completion(self):
        groq__kwargs              = dict(**self.groq_data)
        with LLM__Chat_Completion(**groq__kwargs) as _:
            _.add_message__user("what is 50-8")
            _.add_message__system("just reply with numeric answer")
            _.stream = False
            result_not_streamed = _.chat_completion()
            _.stream = True
            result_streamed     = _.chat_completion()

            assert isinstance(result_not_streamed, str             )
            assert isinstance(result_streamed    , typing.Generator)
            assert '42' in result_not_streamed
            assert '42' in list(result_streamed)






    def test_chat_completion__not_streamed(self):
        load_dotenv()
        groq__kwargs = dict(**self.groq_data, stream=False)
        groq__llm_chat_completion =  LLM__Chat_Completion(**groq__kwargs)
        groq__llm_chat_completion.add_message__user("what is 50-8")
        groq__llm_chat_completion.add_message__system("just reply with numeric answer")


        result = groq__llm_chat_completion.chat_completion__not_streamed()
        assert isinstance(result, str) is True
        assert result == '42'

        self.llm_chat_completion.api_key = ''
        assert self.llm_chat_completion.chat_completion__not_streamed() == 'Provider not available'

    def test_chat_completion__streamed(self):
        groq__kwargs = dict(**self.groq_data, stream=True )
        groq__llm_chat_completion =  LLM__Chat_Completion(**groq__kwargs)
        groq__llm_chat_completion.add_message__user("what is 50-8")
        groq__llm_chat_completion.add_message__system("just reply with numeric answer")


        response = groq__llm_chat_completion.chat_completion__streamed()
        assert isinstance(response, typing.Generator) is True
        result   = list(response)
        assert '42' in result

        self.llm_chat_completion.api_key = ''
        assert list(self.llm_chat_completion.chat_completion__streamed()) == ['Provider not available']


    def test_is_provider_available(self):
        assert self.llm_chat_completion.is_provider_available    () is True
        assert self.llm_chat_completion.is_provider_not_available() is False
        self.llm_chat_completion.api_key = ''
        assert self.llm_chat_completion.is_provider_available    () is False
        assert self.llm_chat_completion.is_provider_not_available() is True
        self.llm_chat_completion.api_key = 'abc'
        assert self.llm_chat_completion.is_provider_available    () is True
        assert self.llm_chat_completion.is_provider_not_available() is False

    def test_json_data(self):
        assert self.llm_chat_completion.json_data() == {'messages': [], 'model': self.model}

    def test_post_data(self):
        with self.llm_chat_completion as _:
            assert _.post_data() == { 'headers': { 'Authorization': f'Bearer {self.api_key}' ,
                                                    'Content-Type': 'application/json'      },
                                                    'json'        : { 'messages': []         ,
                                                                     'model'    : self.model},
                                                    'url'         : self.base_url}

    def test_send_post_data(self):
        with self.llm_chat_completion as _:
            _.api_key   = self.groq_data.get('api_key')
            _.base_url  = self.groq_data.get('base_url')
            _.model     = self.groq_data.get('model')
            _.add_message__user("50-8")
            response    = _.send_post_data()
            assert '42' in response.get('choices')[0].get('message').get('content')
            assert list_set(response) == ['choices', 'created', 'id', 'model', 'object', 'system_fingerprint', 'usage', 'x_groq']

    def test_send_user_prompt(self):
        with self.llm_chat_completion as _:
            _.api_key   = self.groq_data.get('api_key')
            _.base_url  = self.groq_data.get('base_url')
            _.model     = self.groq_data.get('model')
            response    = _.send_user_prompt("50-8")
            assert '42' in response.get('choices')[0].get('message').get('content')
            assert list_set(response) == ['choices', 'created', 'id', 'model', 'object', 'system_fingerprint', 'usage', 'x_groq']

    def test_set_model(self):
        with self.llm_chat_completion as _:
            assert _.model == 'gpt-3'
            _.set_model('abc')
            assert _.model == 'abc'
            _.set_model('gpt-3')
            assert _.model == 'gpt-3'

    def test_set_stream(self):
        with self.llm_chat_completion as _:
            assert _.stream is True
            _.set_stream(False)
            assert _.stream is False
            _.set_stream(True)
            assert _.stream is True

class Mock_History:
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer