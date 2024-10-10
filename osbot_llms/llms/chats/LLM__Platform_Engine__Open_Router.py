from osbot_llms.llms.chats.LLM__Platform_Engine             import LLM__Platform_Engine
from osbot_llms.llms.providers.open_router.LLM__Open_Router import LLM__Open_Router
from osbot_llms.models.LLMs__Chat_Completion                import LLMs__Chat_Completion


class LLM__Platform_Engine__Open_Router(LLM__Platform_Engine):
    llm_platform       : str
    llm_provider       : str
    llm_model          : str
    llm_chat_completion: LLMs__Chat_Completion
    llm_open_router    : LLM__Open_Router

    def execute_request(self):
        user_prompt = self.llm_chat_completion.user_prompt
        images      = self.llm_chat_completion.images
        with self.llm_open_router as _:
            _.add_messages__system(self.llm_chat_completion.system_prompts)
            _.add_histories       (self.llm_chat_completion.histories     )
            _.add_message__user   (user_prompt, images                    )
            _.set_model           (self.llm_model                         )
            _.set_stream          (self.llm_chat_completion.stream        )
            return _.chat_completion()



