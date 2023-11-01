from fastapi import Depends
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

    async def prompt_simple(self, gpt_prompt_simple: GPT_Prompt_Simple = Depends()) -> GPT_Answer :
        question = gpt_prompt_simple.user_prompt
        model    = gpt_prompt_simple.model
        answer   = await self.ask_one_question_no_history(question, model)
        return GPT_Answer(answer=answer)

    async def prompt_with_system(self,gpt_prompt_with_system: GPT_Prompt_With_System = Depends()):
        return gpt_prompt_with_system

    async def ask_one_question_no_history(self,question, model):
        return self.api_open_ai.ask_one_question_no_history(question, model)

    # def setup_routes_old(self):
    #     @self.router.get("/ping")
    #     def ping():
    #         return 'pong'

        # @self.router.post("/prompt_simple")
        # async def prompt_simple(gpt_prompt_simple: GPT_Prompt_Simple = Depends()):
        #     question = gpt_prompt_simple.user_prompt
        #     model = gpt_prompt_simple.model
        #     answer = await self.ask_one_question_no_history(question, model)
        #
        #     return answer

    def setup_routes(self):
        # @self.router.post("/prompt_simple")
        # async def prompt_simple(gpt_prompt_simple: GPT_Prompt_Simple = Depends()):
        #     question = gpt_prompt_simple.user_prompt
        #     model = gpt_prompt_simple.model
        #     return self.ask_one_question_no_history(question, model)

        self.router.post("/prompt_simple"              )(self.prompt_simple)
        self.router.post("/prompt_with_system"         )(self.prompt_with_system)
        self.router.post("/ask_one_question_no_history")(self.ask_one_question_no_history)

        # @self.router.post("/prompt_with_system")
        #
        #
        # @self.router.post("/prompt_with_system_and_history")
        # async def prompt_with_system_and_history(gpt_prompt_with_system_and_history: GPT_Prompt_With_System_And_History = Depends()):
        #     return gpt_prompt_with_system_and_history



