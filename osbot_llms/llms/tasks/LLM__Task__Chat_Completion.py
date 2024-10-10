from osbot_utils.utils.Dev import pprint

from osbot_llms.llms.actions.LLM__Action__Chat_Completion import LLM__Action__Chat_Completion
from osbot_llms.llms.providers.open_router.LLM__Open_Router import LLM__Open_Router
from osbot_llms.llms.tasks.LLM__Task import LLM__Task
from osbot_llms.models.llm_actions.LLM__Request import LLM__Request

# todo: needs refactoring to new @flow/@task driven approach
class LLM__Task__Chat__Completion(LLM__Task):

    def __init__( self, **kwargs ):
        super().__init__(**kwargs)

    def execute(self, llm_request: LLM__Request):
        llm_chat_completion = LLM__Open_Router()
        action_kwargs       = dict(llm_chat_completion = llm_chat_completion,
                                   llm_request         = llm_request        ,
                                   task_id             = self.task_id       ,
                                   workflow_id         = self.workflow_id   )
        action              = LLM__Action__Chat_Completion(**action_kwargs)
        action_result       = action.execute()
        pprint(action_result)
        action_status       = action_result.get('action_status' )
        action_outcome      = action_result.get('action_outcome')

        task_result = dict(status  = action_status,
                           **action_outcome)
        return task_result

