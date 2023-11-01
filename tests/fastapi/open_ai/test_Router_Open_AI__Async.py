from functools import wraps

import pytest
from osbot_utils.testing.Duration                   import duration
from osbot_utils.utils.Dev                          import pprint
from osbot_llms.apis.open_ai.Mock_API_Open_AI       import mock_api_open_ai
from osbot_llms.fastapi.open_ai.Router_Open_AI      import Router_Open_AI
from osbot_llms.fastapi.open_ai.models.GPT_Prompt   import GPT_Prompt_Simple, GPT_Answer


class Test_Router_Open_AI__Async:

#@mock_api_open_ai
    @duration
    def setup_method(self, method):
        self.router = Router_Open_AI()
        #self.router.api_open_ai = Mock_API_Open_AI()
        print(f'about to execute: {method}')

    @pytest.mark.asyncio
    @duration
    async def test_prompt_simple(self):
        question = "what is 40+2, reply with only the answer"
        test_prompt = GPT_Prompt_Simple(model='gpt-3.5-turbo', user_prompt=question)
        response = await self.router.prompt_simple(test_prompt)
        #pprint(response)

        assert response == GPT_Answer(answer='42')
