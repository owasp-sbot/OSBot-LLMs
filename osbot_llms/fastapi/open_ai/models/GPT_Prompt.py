from enum import Enum
from typing import Optional

from pydantic import BaseModel

# princing from https://openai.com/pricing  (OCT 2023)
class GPT_Modules(str, Enum):
    gpt_3_5_turbo     = 'gpt-3.5-turbo'         # 	$0.0015 / 1K tokens	$0.002 / 1K tokens
    gpt_3_5_turbo_16k = 'gpt-3.5-turbo-16k'     # 	$0.003 / 1K tokens	$0.004 / 1K tokens
    gpt_4             = 'gpt-4'                 # 	$0.03 / 1K tokens	$0.06 / 1K tokens
    gpt_4_32k         = 'gpt-4-32k'             # 	$0.06 / 1K tokens	$0.12 / 1K tokens

class GPT_History(BaseModel):
    question : str
    answer   : str

DEFAULT_GPT_ENGINE  = GPT_Modules.gpt_3_5_turbo
DEFAULT_USER_PROMPT = 'Hi'

class GPT_Prompt_Simple(BaseModel):
    model       : GPT_Modules = DEFAULT_GPT_ENGINE
    user_prompt : str         = DEFAULT_USER_PROMPT

class GPT_Prompt_With_System(GPT_Prompt_Simple):
    system_prompt: list[str]

class GPT_Prompt_With_System_And_History(GPT_Prompt_With_System):
    history      : list[GPT_History]


class GPT_Answer(BaseModel):
    model  : Optional[str] = None
    answer: str