from unittest                                   import TestCase
from fastapi                                    import APIRouter
from starlette.routing                          import Router
from osbot_llms.fastapi.FastAPI_Route           import FastAPI_Router
from osbot_llms.fastapi.open_ai.Router_Open_AI  import Router_Open_AI
from osbot_utils.utils.Objects                  import  obj_base_classes


class test_Router_Open_AI(TestCase):

    def setUp(self) -> None:
        self.router_open_ai = Router_Open_AI()
        #self.router_open_ai.api_open_ai = Mock_API_Open_AI()
        self.api_open_ai                = self.router_open_ai.api_open_ai

    def test__init__(self):
        assert type(self.router_open_ai       ) is Router_Open_AI
        assert type(self.router_open_ai.router) is APIRouter
        assert obj_base_classes(self.router_open_ai       ) == [FastAPI_Router, object]
        assert obj_base_classes(self.router_open_ai.router) == [Router, object]

    def test_ask_one_question_no_history(self):
        question = 'answer 40+2, reply with just the answer'
        result = self.api_open_ai.ask_one_question_no_history(question)

        #assert result == '42' # not 100% reliable
        assert '42' in result

# @pytest.mark.asyncio
# async def test_prompt_simple():
#     print('aaa')
#     router = Router_Open_AI()
#     test_prompt = GPT_Prompt_Simple(model='gpt-3.5-turbo', user_prompt='test question')
#
#     response = await router.prompt_simple(test_prompt)
#
#     pprint(response)

        #assert response == {"response": "Mocked response for test question with model gpt-4"}
