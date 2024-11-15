from typing import List, Dict
from pydantic._internal._model_construction import ModelMetaclass

from osbot_llms.llms.API_Open_AI import API_Open_AI
from osbot_utils.base_classes.Type_Safe import Type_Safe
from osbot_utils.context_managers.capture_duration import capture_duration
from osbot_utils.helpers.Timestamp_Now import Timestamp_Now
from osbot_utils.utils.Json import str_to_json


class Prompt_To_Json__Open_AI(Type_Safe):
    response_format : ModelMetaclass
    messages        : List[Dict[str, str]]
    llm_model       : str
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
        with capture_duration() as duration:
            response        = self.invoke__raw()
        response_parsed = self.parse_response(response, duration.seconds)
        return response_parsed

    def invoke__raw(self):
        client = API_Open_AI().client()                                     # todo replace this with requests api (and see the performance implications of creating this object all the time, for example see if there are advantages in caching the requests session)
        return  client.beta.chat.completions.parse(**self.invoke_kwargs())

    def invoke_kwargs(self):
        return dict(model           = self.llm_model      ,
                    messages        = self.messages       ,
                    response_format = self.response_format,
                    seed            = self.seed           ,
                    temperature     =self.temperature     )

    def set_model(self, model):
        self.llm_model = model
        return self

    def set_model__gpt_4o(self):
        return self.set_model("gpt-4o")

    def set_model__gpt_4o_mini(self):
        return self.set_model("gpt-4o-mini")

    def set_response_format(self, response_format):
        self.response_format = response_format
        return self

    def parse_response(self, response, duration):
        choice          = response.choices[0]
        message         = choice.message
        usage           = response.usage
        response_json   = str_to_json(message.content)
        response_parsed = message.parsed
        tokens          = usage.total_tokens
        return dict(response_json   = response_json                ,
                    response_parsed = response_parsed              ,
                    duration        = duration                     ,
                    llm_model       = self.llm_model               ,
                    response_schema = self.response_format.__name__,
                    seed            = self.seed                    ,
                    temperature     = self.temperature             ,
                    timestamp       = Timestamp_Now()              ,
                    tokens          = tokens                       )
