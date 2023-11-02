from functools import wraps

import pytest
from osbot_utils.utils.Misc import obj_info

from osbot_utils.testing.Duration                   import duration
from osbot_utils.utils.Dev                          import pprint
from osbot_llms.apis.open_ai.Mock_API_Open_AI       import mock_api_open_ai
from osbot_llms.fastapi.open_ai.Router_Open_AI      import Router_Open_AI
from osbot_llms.fastapi.open_ai.models.GPT_Prompt import GPT_Prompt_Simple, GPT_Answer, GPT_Prompt_With_System


class Test_Router_Open_AI__Async:

    #@mock_api_open_ai
    #@duration
    def setup_method(self, method):
        self.router = Router_Open_AI()
        #self.router.api_open_ai = Mock_API_Open_AI()
        print(f'about to execute: {method}')

    @pytest.mark.asyncio
    #@duration
    async def test_prompt_simple(self):
        question    = "what is 40+2, reply with only the answer"
        test_prompt = GPT_Prompt_Simple(model='gpt-3.5-turbo', user_prompt=question)
        response = await self.router.prompt_simple(test_prompt)
        assert response == GPT_Answer(answer='42')

    @pytest.mark.asyncio
    #@duration
    async def test_prompt_with_system(self):

        system_prompts = ["Act like a clock, currently it's 10am 2 minutes on Monday 1st Jun 2023, only reply using the format: dd/mm/yy hh:mm"]
        question       = "what is the time and date?"
        kwargs = dict(model          ='gpt-3.5-turbo'   ,
                      user_prompt    = question         ,
                      system_prompts = system_prompts   )
        prompt = GPT_Prompt_With_System(**kwargs)
        response = await self.router.prompt_with_system(prompt)
        assert response.answer == '01/06/23 10:02'

    @pytest.mark.asyncio
    async def test_prompt_with_system__stream(self):
        system_prompts     = ['act like a counter, only reply with the numbers, without any spaces or commands, like this 12']
        question           = 'count to 10'
        kwargs             = dict(model          ='gpt-3.5-turbo'   ,
                                  user_prompt    = question         ,
                                  system_prompts = system_prompts   )
        prompt             = GPT_Prompt_With_System(**kwargs)
        streaming_response = await self.router.prompt_with_system__stream(prompt)

        answers = []
        async for answer in streaming_response.body_iterator:
            answers.append(answer)
        assert answers == ['', '123', '456', '789', '10']



