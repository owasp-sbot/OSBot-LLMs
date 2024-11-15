from pydantic                                               import BaseModel
from typing                                                 import List, Literal
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe

class DocumentChange(BaseModel):
    type    : Literal['addition', 'deletion', 'addition', 'formatting']
    original: str
    updated : str
    reason  : str

class DocumentResponse(BaseModel):
    new_version: str
    changes    : List[DocumentChange]
    summary    : str

class Model__Response_Format__Json_Prompt__Document_Improver(BaseModel):
    document: DocumentResponse
    status  : Literal['success', 'error', 'partial_success', 'no_changes_needed', 'validation_failed']


class Json_Prompt__Document_Improver(Type_Safe):
    prompt_to_json: Prompt_To_Json__Open_AI
    response_format: type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Document_Improver

    def improve_document(self, current_content: str, improvement_request: str):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())
            _.add_message__user(f"""\

-------------  Current document content: -------------
{current_content}
------------------------------------------------------

-------------  Improvement request:      -------------

{improvement_request}

------------------------------------------------------""")
            return _.invoke()

    def system_prompt(self):
        return """You are a document improvement assistant. Follow these rules exactly:

1. Preserve document structure and formatting
2. Maintain key information integrity
3. Keep consistent writing style
5. Only make requested improvements
6. Provide clear reasoning for changes

For each change:
- Include original and modified text
- Explain modification rationale

Return a structured response with:
- Complete updated document
- Detailed change log
- Change summary
- Status indicator"""