from typing import List, Dict

import openai
from pydantic import BaseModel
from pydantic._internal._model_construction import ModelMetaclass

from osbot_llms.llms.API_Open_AI import API_Open_AI
from osbot_utils.base_classes.Type_Safe import Type_Safe
from osbot_utils.utils.Json import str_to_json


class Prompt_To_Json__Open_AI(Type_Safe):
    response_format : ModelMetaclass
    messages        : List[Dict[str, str]]
    model           : str
    temperature     : float
    seed            : int

    def add_message__assistant(self, message):
        return self.add_message("assistant", message)

    def add_message__user(self, message):
        return self.add_message("user", message)

    def add_message__system(self, message):
        return self.add_message("system", message)

    def add_message(self,role, content):
        self.messages.append(dict(role= role, content= content))
        return self

    def invoke(self):
        response        = self.invoke__raw()
        response_parsed = self.parse_response(response)
        return response_parsed

    def invoke__raw(self):
        client = API_Open_AI().client()

        try:
            completion = client.beta.chat.completions.parse(**self.invoke_kwargs())
            return completion
        except Exception as exception:                  # todo: figure out the exceptions to handle here
            raise exception
            # # Handle edge cases
            # if type(e) == openai.LengthFinishReasonError:
            #     # Retry with a higher max tokens
            #     print("Too many tokens: ", e)
            #     pass
            # else:
            #     # Handle other exceptions
            #     print(e)
            #     pass

    def invoke_kwargs(self):
        return dict(model           = self.model          ,
                    messages        = self.messages       ,
                    response_format = self.response_format,
                    seed            = self.seed           ,
                    temperature     =self.temperature     )

    def set_model(self, model):
        self.model = model
        return self

    def set_model__gpt_4o(self):
        return self.set_model("gpt-4o")

    def set_model__gpt_4o_mini(self):
        return self.set_model("gpt-4o-mini")

    def set_response_format(self, response_format):
        self.response_format = response_format
        return self

    def parse_response(self, response):
        choice  = response.choices[0]
        message = choice.message
        usage   = response.usage
        content = str_to_json(message.content)
        model   = message.parsed
        tokens  = usage.total_tokens
        return dict(content = content,
                    model   = model  ,
                    tokens  = tokens )
