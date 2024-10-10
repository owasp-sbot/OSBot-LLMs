import os
import requests
from dotenv import load_dotenv
from osbot_utils.decorators.methods.cache_on_self import cache_on_self
from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Json import json_loads

DEFAULT_MAX_TOKENS = 2048

class API_Perplexity:

    def __init__(self):
        self.url         = "https://api.perplexity.ai/chat/completions"
        self.model       = "mistral-7b-instruct"
        self.temperature = 0
        self.stream      = True                                             # todo: add support for non stream response and check the performance implications of streaming

# avaiable models and pricing (as of Dec 2024) https://docs.perplexity.ai/docs/model-cards anf https://docs.perplexity.ai/docs/pricing
#                                                       $/1M input tokens	$/1M output tokens
#   codellama-34b-instruct	16384	Chat Completion     0.35	            $1.40
#   llama-2-70b-chat	    4096	Chat Completion     $0.70	            $2.80
#   mistral-7b-instruct	    4096 	Chat Completion     $0.07	            $0.28
#   pplx-7b-chat	        8192	Chat Completion     $0.07	            $0.28
#   pplx-70b-chat	        4096	Chat Completion     $0.70	            $2.80
#   pplx-7b-online	        4096	Chat Completion     $5 (1000 requests)  $0.28
#   pplx-70b-online         4096	Chat Completion     $5 (1000 requests)  $0.28

    @cache_on_self
    def api_key(self):
        load_dotenv()
        return os.getenv('PERPLEXITY_API')

    def ask_using_messages(self, messages, model=None, temperature=None, max_tokens=None, async_mode=True):
        generator = self.create(messages, model=model, temperature=temperature, max_tokens=max_tokens)
        if async_mode:
            return generator
        full_answer = ""

        for item in generator:
            if item is not None:
                full_answer += item
        return full_answer

    def ask_using_system_prompts(self, user_prompt, images=None, system_prompts=None, histories=None, model=None,
                                 temperature=None, seed=None, max_tokens=None, async_mode=False):
        messages = []
        if system_prompts:
            for system_prompt in system_prompts:
                messages.append({"role": "system", "content": system_prompt})
        if histories:
            for item in histories:
                question = item.question
                answer   = item.answer
                messages.append({"role": "user"     , "content": question})
                messages.append({"role": "assistant", "content": answer})
        if images:
            user_prompt  = [ { "type"      : "text"      ,
                               "text"      : user_prompt }]
            for image_url in images:
                image = { "type"     : "image_url"       ,
                         "image_url": { "url": image_url }}
                user_prompt.append(image)
        messages.append({"role": "user", "content": user_prompt})

        return self.ask_using_messages(messages, model=model, temperature=temperature, max_tokens=max_tokens,  async_mode=async_mode)


    def create(self, messages,  model=None, temperature=None, max_tokens=None):

        payload = dict(model       = model       or self.model        ,
                       messages    = messages                         ,
                       temperature = temperature or self.temperature  ,
                       stream      = self.stream                      ,
                       max_tokens  = max_tokens  or DEFAULT_MAX_TOKENS)

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {self.api_key()}"
        }

        response = requests.post(self.url, headers=headers, json=payload, stream=payload.get('stream'))
        return self.parse_response(response)

    def parse_response(self, response):
        for line in response.iter_lines():
            if line:
                chunck = line.decode('utf-8')
                if chunck.startswith('data: '):
                    data = json_loads(chunck[6:])
                    for choice in data.get('choices', []):
                        content = choice.get('delta',{}).get('content')
                        yield content
