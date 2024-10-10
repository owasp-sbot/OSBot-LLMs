from osbot_llms.llms.chats.LLM__Platform_Engine            import LLM__Platform_Engine
from osbot_llms.llms.providers.sambanova.LLM__SambaNova    import LLM__SambaNova
from osbot_llms.models.LLMs__Chat_Completion               import LLMs__Chat_Completion


class LLM__Platform_Engine__SambaNova(LLM__Platform_Engine):
    llm_platform       : str
    llm_provider       : str
    llm_model          : str
    llm_chat_completion: LLMs__Chat_Completion
    llm__sambanova     : LLM__SambaNova

    def execute_request(self):
        with self.llm__sambanova as _:
            _.add_messages__system(self.llm_chat_completion.system_prompts)
            _.add_histories       (self.llm_chat_completion.histories     )
            _.add_message__user   (self.llm_chat_completion.user_prompt   )
            _.set_model           (self.llm_model)
            _.set_stream          (self.llm_chat_completion.stream)
            return _.chat_completion()