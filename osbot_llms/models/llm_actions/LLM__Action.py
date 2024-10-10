from osbot_utils.base_classes.Kwargs_To_Self        import Kwargs_To_Self
from osbot_llms.models.llm_actions.LLM__Request     import LLM__Request
from osbot_llms.models.llm_actions.LLM__Response    import LLM__Response

class LLM__Action(Kwargs_To_Self):
    request : LLM__Request
    response: LLM__Response