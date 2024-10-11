from dataclasses import dataclass, field
from decimal import Decimal
from typing import Optional, List

from osbot_utils.base_classes.Type_Safe import Type_Safe
from pydantic                                   import BaseModel
DEFAULT_USER_PROMPT = 'Hi'
DEFAULT_TEMPERATURE = 0.0
DEFAULT_SEED        = 42

@dataclass
class GPT_Prompt_Simple(Type_Safe):
    images        : list                = field(default_factory=list)
    chat_thread_id: Optional[str]       = field(default='')
    user_prompt   : str                 = DEFAULT_USER_PROMPT
    temperature   : float               = float(DEFAULT_TEMPERATURE)
    seed          : int                 = DEFAULT_SEED
    max_tokens    : Optional[int]       = None
    user_data     : Optional[dict]      = None
    stream        : Optional[bool]      = True