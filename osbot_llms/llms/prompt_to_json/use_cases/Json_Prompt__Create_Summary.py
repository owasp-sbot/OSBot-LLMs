from pydantic                                               import BaseModel
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe


class Model__Response_Format__Json_Prompt__Create_Summary(BaseModel):
    summary: str
    keywords: list[str]

class Json_Prompt__Create_Summary(Type_Safe):
    prompt_to_json  : Prompt_To_Json__Open_AI
    response_format : type                      = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Create_Summary


    def create_summary(self, target_text: str):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini (                    )
            _.set_response_format    (self.response_format)
            _.add_message__system    (self.system_prompt())
            _.add_message__user      (target_text         )

            return _.invoke()

    def system_prompt(self):
        return """
You are a precise text summarization system. Follow these rules exactly:

1. ONLY use information explicitly stated in the input text
2. DO NOT add any external knowledge, context, or assumptions
3. DO NOT include any dates, statistics, or specific details unless they appear verbatim in the text
4. DO NOT make generalizations about the topic
5. DO NOT add explanatory or background information
6. For keywords:
   - ONLY extract words/phrases that appear in the original text
   - List them in order of appearance
   - DO NOT add related terms or categories
   - Limit to 5 keywords maximum

FORMAT:
- Summary: One or two sentences using only information from the text
- Keywords: Maximum 5 terms that appear verbatim in the text

If the input text is too short or lacks sufficient content, just provide a very short summary:
"""
