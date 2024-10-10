from decimal import Decimal
from typing                                     import Optional
from pydantic                                   import BaseModel
DEFAULT_USER_PROMPT = 'Hi'
DEFAULT_TEMPERATURE = 0.0
DEFAULT_SEED        = 42

class GPT_Prompt_Simple(BaseModel):
    chat_thread_id: Optional[str]  = None
    user_prompt   : str            = DEFAULT_USER_PROMPT
    images        : list[str]      = []
    temperature   : Decimal        = Decimal(DEFAULT_TEMPERATURE)
    seed          : int            = DEFAULT_SEED
    max_tokens    : Optional[int]  = None
    user_data     : Optional[dict] = None
    stream        : Optional[bool] = True