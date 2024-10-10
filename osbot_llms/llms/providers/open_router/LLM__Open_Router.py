from enum                                           import Enum
from os                                             import getenv
from osbot_llms.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion

LLM_BASE_URL__OPEN_ROUTER = "https://openrouter.ai/api/v1/chat/completions"

class LLM__Providers(str, Enum):
    AWS_BEDROCK = "aws-bedrock"
    GROQ        = "groq"
    OPEN_AI     = "open-ai"
    OPEN_ROUTER = "open-router"

class LLM__Models__Open_Router(str, Enum):
    GEMINI_FLASH_1_5  = 'google/gemini-flash-1.5'
    LLAMA_3_8B__FREE  = "meta-llama/llama-3-8b-instruct:free"
    CAPYBARA_7B__FREE = "nousresearch/nous-capybara-7b:free"
    OPEN_AI_4o        = 'openai/gpt-4o'
    OPEN_AI_3_5       = 'openai/gpt-3.5-turbo'

class LLM__Open_Router(LLM__Chat_Completion):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.api_key  = getenv("OPEN_ROUTER_API_KEY")
        self.base_url = LLM_BASE_URL__OPEN_ROUTER
        super().__init__()

