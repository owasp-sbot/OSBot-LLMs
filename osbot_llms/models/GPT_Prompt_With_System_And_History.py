from dataclasses import dataclass
from typing                                                import Optional

from osbot_llms.models.GPT_History            import GPT_History
from osbot_llms.models.GPT_Prompt_With_System import GPT_Prompt_With_System

@dataclass
class GPT_Prompt_With_System_And_History(GPT_Prompt_With_System):
    histories      : Optional[list[GPT_History]] = None