from decimal                                                import Decimal
from osbot_utils.base_classes.Kwargs_To_Self                import Kwargs_To_Self
from osbot_utils.helpers.Random_Guid                        import Random_Guid
from osbot_llms.llms.providers.open_router.LLM__Open_Router import LLM__Models__Open_Router, LLM__Providers

LLM_REQUEST__DEFAULT_MAX_TOKENS     = 4092
LLM_REQUEST__DEFAULT_MODEL          = LLM__Models__Open_Router.LLAMA_3_8B__FREE
LLM_REQUEST__DEFAULT_MODEL_PROVIDER = LLM__Providers.OPEN_ROUTER
LLM_REQUEST__DEFAULT_SEED           = 42
LLM_REQUEST__DEFAULT_TEMPERATURE    = Decimal('0.1')        # use '0.1' instead of 0.1, so that we don't get Decimal('0.1000000000000000055511151231257827021181583404541015625')
LLM_REQUEST__DEFAULT_USER_PROMPT    = 'Hi'

class LLM__Request(Kwargs_To_Self):
    chat_thread_id : Random_Guid
    histories      : list
    images         : list
    max_tokens     : int     = LLM_REQUEST__DEFAULT_MAX_TOKENS
    model          : str     = LLM_REQUEST__DEFAULT_MODEL
    model_provider : str     = LLM_REQUEST__DEFAULT_MODEL_PROVIDER
    seed           : int     = LLM_REQUEST__DEFAULT_SEED
    system_prompts : list
    temperature    : Decimal
    user_data      : dict
    user_prompt    : str     = LLM_REQUEST__DEFAULT_USER_PROMPT

    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.temperature = Decimal(LLM_REQUEST__DEFAULT_TEMPERATURE)        # todo, see if we can add Decimal to the classes that can safely be handled by Kwargs_To_Self on the initial values setup