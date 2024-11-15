from pydantic                                               import BaseModel
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe

class Model__Response_Format__Json_Prompt__Validate_Summary(BaseModel):
    is_valid     : bool
    confidence   : float
    quality      : float
    issues_found : list[str]

class Json_Prompt__Validate_Summary(Type_Safe):
    prompt_to_json  : Prompt_To_Json__Open_AI
    response_format : type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Validate_Summary

    def validate_summary(self, original_text: str, summary: str):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())
            _.add_message__user(f"""Original Text:
{original_text}

Summary to validate:
{summary}""")
            return _.invoke()

    def system_prompt(self):
        return """Analyze if the provided summary accurately represents the original text.
Rules:
1. Check if summary ONLY contains information from original text
2. Verify no external knowledge/assumptions added
3. Confirm dates/stats appear in original
4. Check for over generalizations
5. Look for added explanatory content

Score explanation:
- confidence: your certainty in the assessment
- quality: how well summary reflects original content

Return detailed issues list for any problems found."""