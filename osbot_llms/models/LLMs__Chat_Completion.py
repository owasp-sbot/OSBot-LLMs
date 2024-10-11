from dataclasses import dataclass
from typing import Optional

from fastapi.params import Body

from osbot_llms.models.GPT_Prompt_With_System_And_History import GPT_Prompt_With_System_And_History

SWAGGER_EXAMPLE__LLMs__Chat_Completion  = Body(..., example=dict(user_prompt    ='Good morning, what is 44-2?',
                                                                        system_prompts = ['use emojis in the answer' ],
                                                                        #temperature    = 0.0                         ,
                                                                        seed           = 42                           ,
                                                                        stream         = False                        ))

@dataclass
class LLMs__Chat_Completion(GPT_Prompt_With_System_And_History):
    llm_platform: Optional[str] = None
    llm_provider: Optional[str] = None
    llm_model   : Optional[str] = None
    llm_answer  : Optional[str] = None