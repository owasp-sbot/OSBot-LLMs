from cbr_athena.aws.dynamo_db.DyDB__CBR_Workflows           import DyDB__CBR_Workflows
from cbr_athena.llms.actions.LLM__Action__Chat_Completion   import LLM__Action__Chat_Completion
from cbr_athena.llms.providers.open_router.LLM__Open_Router import LLM__Open_Router
from cbr_athena.llms.tasks.LLM__Task                        import LLM__Task
from cbr_athena.schemas.llm_actions                         import LLM__Request


class LLM__Task__Chat__Completion(LLM__Task):
    dydb_cbr_workflows : DyDB__CBR_Workflows

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

        action_status       = action_result.get('action_status' )
        action_outcome      = action_result.get('action_outcome')
        document_id         = self.add_action_to_dynamo_db(action_result)

        task_result = dict(dydb_id = document_id,
                           status  = action_status,
                           **action_outcome)
        return task_result


    def add_action_to_dynamo_db(self, document):
        return self.dydb_cbr_workflows.add_document(document)

