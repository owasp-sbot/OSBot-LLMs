from pydantic                                               import BaseModel
from typing                                                 import List, Literal, Optional
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe

class FormField(BaseModel):
    name        : str
    type        : Literal['text', 'number', 'email', 'password', 'date', 'select', 'radio', 'checkbox', 'textarea']
    label       : str
    required    : bool
    placeholder : Optional[str] = None
    options     : Optional[List[str]] = None  # For select, radio, checkbox
    validation  : Optional[str] = None     # Custom validation rules

class FormSection(BaseModel):
    title: Optional[str] = None
    fields: List[FormField]
    description: Optional[str] = None

class FormResponse(BaseModel):
    title: str
    description: Optional[str] = None
    sections: List[FormSection]
    submit_button_text: str

class Model__Response_Format__Json_Prompt__Form_Generator(BaseModel):
    form: FormResponse
    status: Literal['success', 'error', 'partial_success', 'validation_failed']

class Json_Prompt__Form_Generator(Type_Safe):
    prompt_to_json: Prompt_To_Json__Open_AI
    response_format: type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Form_Generator

    def generate_form(self, form_requirements: str):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())
            _.add_message__user(f"Form requirements:\n{form_requirements}")
            return _.invoke()

    def system_prompt(self):
        return """Generate an HTML form based on the requirements provided. Follow these rules exactly:

1. Create semantic and accessible HTML form structure
2. Include appropriate form validation
3. Generate responsive and clean form layout
4. Use semantic field types and input attributes
5. Include proper labels and ARIA attributes
6. Structure complex forms into logical sections
7. Apply consistent styling classes
8. Include clear submission handling

For each form field:
- Choose appropriate input type
- Add relevant validation attributes
- Include helpful placeholder text
- Maintain logical tab order

Return a structured response with:
- Complete form specification
- Status indicator
"""