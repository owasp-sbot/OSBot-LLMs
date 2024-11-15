from pydantic                                               import BaseModel
from typing                                                 import List, Literal, Optional
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe


class EmailResponse(BaseModel):
    subject     : str
    sender      : Optional[str] = None
    recipients  : List[str]
    cc          : Optional[List[str]] = None
    bcc         : Optional[List[str]] = None
    body        : str
    body_html   : Optional[str] = None
    tone        : Literal['formal', 'casual', 'professional', 'friendly', 'urgent']
    preview_text: Optional[str] = None


class Model__Response_Format__Json_Prompt__Email_Generator(BaseModel):
    email      : EmailResponse
    status     : Literal['success', 'error', 'partial_success', 'validation_failed']

class Json_Prompt__Email_Generator(Type_Safe):
    prompt_to_json : Prompt_To_Json__Open_AI
    response_format: type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Email_Generator

    def generate_email(self, email_requirements: str, context: Optional[dict] = None):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())

            prompt = f"Email requirements:\n{email_requirements}\n"
            if context:
                prompt += f"\nContext:\n{self._format_context(context)}"

            _.add_message__user(prompt)
            return _.invoke()

    def _format_context(self, context: dict) -> str:
        """Format context dictionary into a readable string."""
        formatted = []
        for key, value in context.items():
            formatted.append(f"{key}:\n{value}")
        return "\n\n".join(formatted)

    def system_prompt(self):
        return """Generate professional and effective emails based on requirements. Follow these rules exactly:

1. Email Structure
   - Clear and concise subject lines
   - Well-organized paragraphs

2. Content Guidelines
   - Match tone to purpose and audience
   - Include all necessary information (but don't add any key information that is has not been provided)
   - Be clear and specific
   - Maintain professional language
   - Follow business email etiquette

3. Format Requirements
   - Generate both HTML and plain text versions
   - Include preview text for email clients   
   - Handle recipients properly (To, CC, BCC)

4. Style Considerations
   - Adapt tone to context
   - Use appropriate level of formality
   - Include clear call-to-action when needed
   - Maintain consistent formatting

5. Communication Best Practices
   - Be concise and direct
   - Highlight important information
   - Include necessary context
   - Use appropriate emphasis
   - Ensure clarity of message

Return a structured response with:
- Complete email content
- Status indicator

The email should be:
- Well-structured
- Grammatically correct
- Appropriate for the context
- Professional
- Clear and actionable

Dont add any key information that has not been provided (it's better to leave it out than to make it up), for example:
 - emails that has not been provided
 - names  that has not been provided  
 - actions that has not been provided
 - placeholders like [Your Name]
 
It is better to have a short email that is clear and actionable than anything that has wrong information
"""