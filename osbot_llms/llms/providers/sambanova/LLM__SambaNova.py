from os import getenv
from osbot_llms.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion

LLM_PLATFORM_NAME           = 'SambaNova (Free)'
ENV_NAME__SAMBANOVA_API_KEY = 'SAMBANOVA_API_KEY'
LLM_BASE_URL__MISTRAL       = 'https://api.sambanova.ai/v1/chat/completions'
SAMBANOVA__DEFAULT_MODEL    = 'Meta-Llama-3.1-405B-Instruct'

class LLM__SambaNova(LLM__Chat_Completion):

    def __init__(self) -> None:
        self.api_key  = getenv(ENV_NAME__SAMBANOVA_API_KEY)
        self.base_url = LLM_BASE_URL__MISTRAL
        self.model    = SAMBANOVA__DEFAULT_MODEL
        super().__init__()

