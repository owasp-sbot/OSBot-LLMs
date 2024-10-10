

from osbot_utils.base_classes.Type_Safe                        import Type_Safe
from osbot_utils.decorators.methods.cache_on_self              import cache_on_self
from osbot_llms.llms.chats.LLM__Platform_Engine__Groq          import LLM__Platform_Engine__Groq
from osbot_llms.llms.chats.LLM__Platform_Engine__Mistral       import LLM__Platform_Engine__Mistral
from osbot_llms.llms.chats.LLM__Platform_Engine__Ollama        import LLM__Platform_Engine__Ollama
from osbot_llms.llms.chats.LLM__Platform_Engine__Open_Router   import LLM__Platform_Engine__Open_Router
from osbot_llms.llms.chats.LLM__Platform_Engine__SambaNova     import LLM__Platform_Engine__SambaNova
from osbot_llms.llms.chats.LLM__Platform_Engine__Together_AI   import LLM__Platform_Engine__Together_AI
from osbot_llms.models.LLMs__Chat_Completion                   import LLMs__Chat_Completion

USER_DATA__VAR_NAME__PLATFORM = 'selected_platform'
USER_DATA__VAR_NAME__PROVIDER = 'selected_provider'
USER_DATA__VAR_NAME__MODEL    = 'selected_model'

class LLM__Chat_Completion__Resolve_Engine(Type_Safe):

    @cache_on_self
    def llms_platform_engines(self):
        return {'Groq (Free)'        : LLM__Platform_Engine__Groq        ,
                'Ollama (Local)'     : LLM__Platform_Engine__Ollama      ,
                'Together AI (Paid)' : LLM__Platform_Engine__Together_AI ,
                'Open Router (Free)' : LLM__Platform_Engine__Open_Router ,
                'Open Router (Paid)' : LLM__Platform_Engine__Open_Router ,
                'Mistral (Free)'     : LLM__Platform_Engine__Mistral     ,
                'SambaNova (Free)'   : LLM__Platform_Engine__SambaNova   }

    def map_provider(self, llm_chat_completion: LLMs__Chat_Completion):
        llm_platform              = self.resolve__llm_platform(llm_chat_completion)       # todo: refactor out when there is no need to keep the main chat JS UI compatible with the previous API endpoint
        llm_provider              = self.resolve__llm_provider(llm_chat_completion)
        llm_model                 = self.resolve__llm_model   (llm_chat_completion)
        llm_platform_engine_class = self.llms_platform_engines().get(llm_platform)
        if llm_platform_engine_class:
            platform_kwargs     = dict(llm_platform=llm_platform, llm_provider=llm_provider,llm_model=llm_model,  llm_chat_completion=llm_chat_completion)
            llm_platform_engine = llm_platform_engine_class(**platform_kwargs)
            return llm_platform_engine
        return None
        #return f"Going to handle the request with {llm_platform} | {llm_provider} | {llm_model}"

    def resolve__llm_platform(self, llm_chat_completion: LLMs__Chat_Completion):
        user_data = llm_chat_completion.user_data or {}
        return user_data.get(USER_DATA__VAR_NAME__PLATFORM) or llm_chat_completion.llm_platform

    def resolve__llm_provider(self, llm_chat_completion: LLMs__Chat_Completion):
        user_data = llm_chat_completion.user_data or {}
        return user_data.get(USER_DATA__VAR_NAME__PROVIDER) or llm_chat_completion.llm_provider

    def resolve__llm_model(self, llm_chat_completion: LLMs__Chat_Completion):
        user_data = llm_chat_completion.user_data or {}
        return user_data.get(USER_DATA__VAR_NAME__MODEL) or llm_chat_completion.llm_model
