from osbot_utils.base_classes.Type_Safe import Type_Safe
from osbot_utils.helpers.Random_Guid import Random_Guid
from osbot_utils.utils.Misc                                 import timestamp_utc_now
from osbot_utils.utils.Status                               import status_ok, status_error
from osbot_llms.llms.providers.LLM__Chat_Completion         import LLM__Chat_Completion
from osbot_llms.models.llm_actions.LLM__Request             import LLM__Request


class LLM__Action__Chat_Completion(Type_Safe):
    action_id           : Random_Guid
    action_name         : str                 = 'LLM Action - Call Completion'
    action_outcome      : dict
    llm_chat_completion : LLM__Chat_Completion = None
    llm_request         : LLM__Request          = None
    llm_response        : dict
    system_prompts      : list
    action_steps        : list
    task_id             : Random_Guid
    workflow_id         : Random_Guid

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.action_steps = [self.step_1__check_llm_request     ,
                             self.step_2__create_llm_json_data  ,
                             self.step_3__llm_chat_completion   ,
                             self.step_4__extract_content       ]

    def execute(self):
        steps_result            = []
        step_data               = {}
        step_status             = 'NA'
        step_name               = 'NA'
        timestamp_action_start  = timestamp_utc_now()
        for action_step in self.action_steps:
            timestamp_start = timestamp_utc_now()
            step_name       = action_step.__name__
            try:
                step_data   = action_step()
                step_status = step_data.get('status')
            except Exception as e:
                step_status = 'exception'
                step_data   = {'exception': str(e) }

            timestamp_end = timestamp_utc_now()
            step_result = dict(name            = step_name           ,
                               step_data       = step_data           ,
                               step_status     = step_status         ,
                               timestamp_start = timestamp_start     ,
                               timestamp_end   = timestamp_end       )
            steps_result.append(step_result)
            if step_status != 'ok':
                break
        timestamp_action_end = timestamp_utc_now()

        if step_status == 'ok':
            action_status  = 'ok'
            action_message = f'action executed ok: {self.action_name}'
        elif step_status == 'exception':
            action_status = 'failed'
            action_message = step_data.get('exception')
        else:
            action_status  = 'failed'
            action_message = f'action failed :{self.action_name}'

        result = dict(action_id       = self.action_id         ,
                      action_name     = self.action_name       ,
                      action_message  = action_message         ,
                      action_outcome  = self.action_outcome    ,
                      action_status   = action_status          ,
                      last_step       = step_name              ,
                      timestamp_start = timestamp_action_start ,
                      timestamp_end   = timestamp_action_end   ,
                      steps_result    = steps_result           ,
                      task_id         = self.task_id           ,
                      workflow_id     = self.workflow_id       )
        return result

    def supported_model(self, model_provider, model):
        if model_provider == LLM__Providers.OPEN_ROUTER:
            if model in LLM__Models__Open_Router._value2member_map_:
                return True
        return False

    def step_1__check_llm_request(self):
        model          = self.llm_request.model
        model_provider = self.llm_request.model_provider
        user_prompt    = self.llm_request.user_prompt

        if not self.supported_model(model_provider, model):
            raise ValueError(f'Request provider {model_provider} and model {model} not supported')

        if not user_prompt:
            raise ValueError(f'no user prompt provided')

        if self.llm_chat_completion is None:
            raise ValueError(f'target llm_chat_completion was not set')

        if not isinstance(self.llm_chat_completion, LLM__Chat_Completion):
            raise ValueError(f'self.llm_chat_completion had the wrong type, it needs to implement LLM__Chat_Completion')

        step_data = dict(llm_request = self.llm_request.json())
        return status_ok(data=step_data)

    def step_2__create_llm_json_data(self):
        self.llm_chat_completion.add_messages__system(self.llm_request.system_prompts)
        self.llm_chat_completion.add_message__user   (self.llm_request.user_prompt   )
        json_data = self.llm_chat_completion.json_data()
        return status_ok(data=json_data)

    def step_3__llm_chat_completion(self):
        self.llm_response = self.llm_chat_completion.send_post_data()            # todo: add check for LLM response
        step_data = dict(llm_response = self.llm_response)
        return status_ok(data=step_data)

    def step_4__extract_content(self):
        if type(self.llm_response) is dict:
            choices = self.llm_response.get('choices')
            if choices and len(choices) > 0:
                choice  = choices[0]
                content = choice.get('message', {}).get('content')
                if content:                                         # todo add more checks here, to deal with edge cases
                    self.action_outcome = {'content': content}
                    return status_ok(data=self.action_outcome)
        return status_error(error='could not extract content from llm response')
