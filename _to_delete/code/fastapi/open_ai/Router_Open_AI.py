from fastapi import Depends
from starlette.responses import StreamingResponse

from osbot_llms.apis.open_ai.API_Open_AI import API_Open_AI
from osbot_llms.apis.open_ai.Mock_API_Open_AI import Mock_API_Open_AI
from osbot_llms.fastapi.FastAPI_Route import FastAPI_Router
from osbot_llms.fastapi.open_ai.models.GPT_Prompt import GPT_Prompt_Simple, GPT_Prompt_With_System, \
    GPT_Prompt_With_System_And_History, GPT_Answer


class Router_Open_AI(FastAPI_Router):

    def __init__(self, app=None):
        super().__init__(app, name='Open AI')
        self.setup_routes()
        super().setup()
        self.api_open_ai = API_Open_AI().setup()
        #self.api_open_ai = Mock_API_Open_AI()

    async def prompt_simple(self, gpt_prompt_simple: GPT_Prompt_Simple)-> GPT_Answer : # = Depends())
        question = gpt_prompt_simple.user_prompt
        model    = gpt_prompt_simple.model
        answer   = self.api_open_ai.ask_one_question_no_history(question, model)
        #answer   = await self.ask_one_question_no_history(question, model)
        return GPT_Answer(answer=answer)

    async def prompt_with_system(self,gpt_prompt_with_system: GPT_Prompt_With_System):# = Depends()):
        user_prompt    = gpt_prompt_with_system.user_prompt
        system_prompts = gpt_prompt_with_system.system_prompts
        answer         = self.api_open_ai.ask_using_system_prompts(user_prompt=user_prompt, system_prompts=system_prompts)
        return GPT_Answer(answer=answer)

    async def prompt_with_system__stream(self,gpt_prompt_with_system_and_history: GPT_Prompt_With_System_And_History):# = Depends()):
        async def streamer():
            user_prompt    = gpt_prompt_with_system_and_history.user_prompt
            images         = gpt_prompt_with_system_and_history.images
            system_prompts = gpt_prompt_with_system_and_history.system_prompts
            histories      = gpt_prompt_with_system_and_history.histories
            model          = gpt_prompt_with_system_and_history.model.value
            temperature    = gpt_prompt_with_system_and_history.temperature
            seed           = gpt_prompt_with_system_and_history.seed
            max_tokens     = gpt_prompt_with_system_and_history.max_tokens
            async_mode     = True
            generator      = self.api_open_ai.ask_using_system_prompts( user_prompt    = user_prompt    ,
                                                                        images         = images         ,
                                                                        system_prompts = system_prompts ,
                                                                        histories      = histories      ,
                                                                        model          = model          ,
                                                                        temperature    = temperature    ,
                                                                        seed           = seed           ,
                                                                        max_tokens     = max_tokens     ,
                                                                        async_mode     = async_mode     )
            for answer in generator:
                if answer:
                    yield f"{answer}\n"

        return StreamingResponse(streamer(), media_type="text/plain; charset=utf-8")

    def setup_routes(self):
        self.router.post("/prompt_simple"              )(self.prompt_simple)
        self.router.post("/prompt_with_system"         )(self.prompt_with_system)
        self.router.post("/prompt_with_system__stream" )(self.prompt_with_system__stream)
        #self.router.post("/ask_one_question_no_history")(self.ask_one_question_no_history)


