from os                                                     import getenv
from unittest                                               import TestCase
from osbot_utils.utils.Env                                  import load_dotenv
from osbot_utils.utils.Misc                                 import list_set
from osbot_utils.utils.Objects                              import dict_to_obj
from osbot_llms.llms.providers.open_router.LLM__Open_Router import LLM__Open_Router, LLM__Models__Open_Router

#@pytest.mark.skip("needs refactoring to new @flow/@task driven approach")
class test_LLM_Open_Router(TestCase):

    @classmethod
    def setUpClass(cls):
        load_dotenv()
        cls.llm_model = "meta-llama/llama-3-8b-instruct:free"
        cls.llm_open_router = LLM__Open_Router(model=cls.llm_model)

    def test__init__(self):
        with self.llm_open_router  as _:
            assert _.__locals__() == {'api_key' :  getenv("OPEN_ROUTER_API_KEY")                 ,
                                      'base_url': 'https://openrouter.ai/api/v1/chat/completions',
                                      'messages' : []                                            ,
                                      'model'   : self.llm_model                                 ,
                                      'stream'  : True                                           }

            assert _.api_key is not None

    def test_send_user_prompt(self):
        user_prompt = "2+2"
        self.llm_open_router.add_message__system('reply in one word only')
        response = self.llm_open_router.send_user_prompt(user_prompt=user_prompt)
        assert dict_to_obj(response).choices[0].message.content == '4'
        assert list_set(response) == ['choices', 'created', 'id', 'model', 'object', 'provider','usage']

    # @pytest.mark.skip("for now only run locally")
    # def test_send_multiple_user_prompt(self):
    #     #content = "can you write a story about 2+2 in 1 words"
    #     #self.cache.update()
    #     user_prompts = ["2+2"           , # 0
    #                     "Antonym of hot?",
    #                     "Capital of France?", # 2
    #                     "Is the sky green?",
    #                     "Hello in Spanish?", # 4
    #                     "Roses are red, violets are...",
    #                     "Synonym of quick?", # 6
    #                     "1, 2, 3, 4,.." ,
    #                     "Earth is a...?",  # 8
    #                     "Is water wet?" ,
    #                     ""                  # 10 empty message on purpose
    #                     ]
    #
    #     print()
    #     #logging = Logging(log_to_console=True)
    #     for user_prompt in user_prompts[0:12]:
    #         llm_open_router = LLM__Open_Router().add_message__system('reply in one word only')
    #         response = llm_open_router.send_user_prompt(user_prompt=user_prompt)
    #         #logging.debug(user_prompt)
    #         if 'error' in response:
    #             #logging.debug(f"1) ERROR: {user_prompt}  :  {response['error']} (retrying)")
    #             self.cache.update(True)
    #             llm_open_router = LLM__Open_Router().add_message__system('reply in one word only')
    #             response = llm_open_router.send_user_prompt(user_prompt=user_prompt)
    #             self.cache.update(False)
    #
    #         if 'error' in response:
    #             #logging.debug(f"2) ERROR!!! AGAIN: {user_prompt}  :  {response['error']} (retrying)")
    #             print('ERROR twice')
    #         else:
    #             content  = response.get('choices')[0].get('message').get('content')
    #             #logging.debug(f'{user_prompt}: {content}')
    #             print
    #             print(f'{user_prompt:30}: {content.strip()}')

