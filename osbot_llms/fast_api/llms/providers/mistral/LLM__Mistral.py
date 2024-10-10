from os import getenv

import requests

from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Env import get_env

from osbot_llms.fast_api.llms.providers.LLM__Chat_Completion import LLM__Chat_Completion

LLM_PLATFORM_NAME         = 'Mistral (Free)'
ENV_NAME__MISTRAL_API_KEY = 'MISTRAL_API_KEY'
LLM_BASE_URL__MISTRAL     = 'https://api.mistral.ai/v1/chat/completions'
MISTRAL__DEFAULT_MODEL    = 'pixtral-12b-2409'

class LLM__Mistral(LLM__Chat_Completion):

    def __init__(self) -> None:
        self.api_key  = getenv(ENV_NAME__MISTRAL_API_KEY)
        self.base_url = LLM_BASE_URL__MISTRAL
        self.model    = MISTRAL__DEFAULT_MODEL
        super().__init__()

