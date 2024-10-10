from unittest import TestCase

import pytest
from osbot_llms.llms.tasks.LLM__Task__Chat_Completion import LLM__Task__Chat__Completion
from osbot_llms.models.llm_actions.LLM__Request import LLM__Request


@pytest.mark.skip("needs refactoring to new @flow/@task driven approach")
class test_LLM__Task__Chat__Completion(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.task = LLM__Task__Chat__Completion()

    def test__init__(self):
        with self.task as _:
            assert _.__locals__() == { 'task_id'            : _.task_id             ,
                                       'workflow_id'        : _.workflow_id         }

    def test_execute(self):
        system_prompts  = ['reply in one word']
        user_prompt     = '40+2'
        llm_request     = LLM__Request(user_prompt=user_prompt,system_prompts=system_prompts)
        result          = self.task.execute(llm_request)
        dydb_id         = result.get('dydb_id')
        assert result   == { 'content': '42',
                             'status' : 'ok'}

