from enum import Enum
from os import getenv
from osbot_llms.fast_api.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion

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
    #model: Models__Open_Router = Models__Open_Router.GEMINI_FLASH_1_5
    #model: LLM__Models__Open_Router = LLM__Models__Open_Router.LLAMA_3_8B__FREE     # started to fail

    def __init__(self) -> None:
        self.api_key  = getenv("OPEN_ROUTER_API_KEY")
        self.base_url = LLM_BASE_URL__OPEN_ROUTER
        super().__init__()

    # @cache_on_self
    # def api_key(self):
    #     return getenv("OPEN_ROUTER_API_KEY")

    # model    = Models__Open_Router.OPEN_AI_3_5

    # # # todo add separate support for streaming (which is only needed when interacting directly with the user in a chat
    # def post_data__stream(self, **kwargs):
    #     url     = self.base_url
    #     headers = {"Authorization": f"Bearer {self.api_key}",
    #                "Content-Type": "application/json"}
    #     json    = self.json_data(**kwargs)
    #     return dict(url=url, headers=headers, json=json, stream=True)
    #
    # # todo add separate support for streaming (which is only needed when interacting directly with the user in a chat
    # def make_request_stream(self, **kwargs):
    #     logging = Logging()
    #     logging.enable_pycharm_logging()
    #
    #     logging.debug("about to send data")
    #     post_data = self.post_data(**kwargs)
    #     response  = requests.post(**post_data)
    #     logging.debug(f"received data with status: {response.status_code}")
    #
    #     if response.status_code == 200:
    #         # Iterate over the response in chunks
    #         for chunk in response.iter_lines():
    #             print(len(chunk))
    #             if chunk:
    #                 # Process each chunk (here we are just printing it)
    #                 logging.debug(chunk.decode('utf-8').strip())
    #     return response
