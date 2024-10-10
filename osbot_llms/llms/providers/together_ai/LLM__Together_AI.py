from osbot_llms.llms.providers.LLM__Chat_Completion    import LLM__Chat_Completion
from osbot_utils.utils.Env                             import get_env

TOGETHER_AI__LLM_BASE_URL  = "https://api.together.xyz/v1/completions/"
TOGETHER_AI__DEFAULT_MODEL = "meta-llama/Llama-3-70b-chat-hf"

class LLM__Together_AI(LLM__Chat_Completion):

    def __init__(self) -> None:
        self.api_key = get_env("TOGETHER_AI_API_KEY")
        self.base_url = TOGETHER_AI__LLM_BASE_URL
        self.model    = TOGETHER_AI__DEFAULT_MODEL
        super().__init__()