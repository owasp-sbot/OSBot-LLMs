import pytest
from unittest                                               import TestCase
from osbot_utils.utils.Env                                  import in_github_action
from osbot_llms.llms.actions.LLM__Action__Chat_Completion   import LLM__Action__Chat_Completion
from osbot_llms.llms.providers.open_router.LLM__Open_Router import LLM__Open_Router
from osbot_llms.models.llm_actions.LLM__Request             import LLM__Request


@pytest.mark.skip("needs refactoring to new @flow/@task driven approach")
class test_LLM__Action__Call_Completion(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()                            # required to enable the Chat_Completions Cache
        cls.llm_chat_completion = LLM__Open_Router
        cls.action = LLM__Action__Chat_Completion(llm_chat_completion=LLM__Open_Router())


    def test_execute(self):
        if in_github_action():
            pytest.skip("Was failing with too many requests ")
        user_prompt             = '40+2+2-1'
        system_prompts          = ['reply in one word']
        llm_request             = LLM__Request(user_prompt=user_prompt, system_prompts=system_prompts)
        self.action.llm_request = llm_request
        action_data             = self.action.execute()
        assert action_data.get('action_status') == 'ok'