from os                                             import getenv
from osbot_llms.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion

ENV_NAME__GROQ_API_KEY = 'GROQ_API_KEY'
LLM_BASE_URL__GROQ     = 'https://api.groq.com/openai/v1/chat/completions'

class LLM__Groq(LLM__Chat_Completion):

    def __init__(self) -> None:
        self.api_key  = getenv(ENV_NAME__GROQ_API_KEY)
        self.base_url = LLM_BASE_URL__GROQ
        super().__init__()

