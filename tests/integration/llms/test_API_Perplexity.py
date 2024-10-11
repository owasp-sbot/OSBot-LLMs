import pytest
from unittest import TestCase

from osbot_llms.llms.API_Perplexity import API_Perplexity
from osbot_llms.models.GPT_History import GPT_History


#@pytest.mark.skip("Re-enable when adding ofical support to TCB to the Perplexity API")
class test_API_Perplexity(TestCase):

    def setUp(self):
        self.api_perplexity = API_Perplexity()

    def test_api_key(self):
        assert self.api_perplexity.api_key().startswith('pplx-')

    def test_ask_using_messages__async_mode(self):
        model             = "mistral-7b-instruct"
        system_prompt     = "act like a calculator, just reply with the answer"
        user_prompt       = "2+1"
        #expected_response = ['', '42', '']
        async_mode        = True
        # expected_response = ['Sure', '! ', '40', ' + ', '2 =', ' 4', '2.', '']     for #'llama-2-70b-chat' #
        messages = [ { "role"    : "system"      ,
                       "content" : system_prompt },
                     { "role"    : "user",
                       "content" : user_prompt}]
        generator = self.api_perplexity.ask_using_messages(messages, model=model, async_mode=async_mode)

        assert '3' in ' '.join(list(generator))


    def test_ask_using_messages__sync_mode(self):
        model             = "mistral-7b-instruct"
        system_prompt     = "act like a calculator, just reply with the answer"
        user_prompt       = "1+2"
        async_mode        = False
        messages = [ { "role"    : "system"      ,
                       "content" : system_prompt },
                     { "role"    : "user",
                       "content" : user_prompt}]
        response  = self.api_perplexity.ask_using_messages(messages, model=model, async_mode=async_mode)
        assert '3' in response


    def test_ask_using_system_prompts(self):
        kwargs= dict(user_prompt    = 'what is 40+2',
                     images         = None  ,
                     system_prompts = None  ,
                     histories      = None  ,
                     model          = None  ,
                     temperature    = None  ,
                     seed           = None  ,
                     max_tokens     = None  ,
                     async_mode     = False )
        result = self.api_perplexity.ask_using_system_prompts(**kwargs)
        assert '42' in result

        # user_prompt = 'in one word, what is your base LLM model?'
        # model       = 'llama-2-70b-chat'
        # result      = self.api_perplexity.ask_using_system_prompts(user_prompt, model=model)
        # assert result == 'BERT.'

    def test_ask_using_system_prompts__with_history(self):
        gpt_history = GPT_History(question='Hi my name is John', answer='Hi John')
        kwargs= dict(user_prompt    = 'what is my name?',
                       histories    = [gpt_history]    )
        result = self.api_perplexity.ask_using_system_prompts(**kwargs)
        assert 'John' in result
