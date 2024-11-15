from pydantic                                                                import BaseModel
from osbot_fast_api.api.Fast_API_Routes                                      import Fast_API_Routes
from typing import Optional, Dict, TypeVar, Type
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Create_Summary    import Model__Response_Format__Json_Prompt__Create_Summary, Json_Prompt__Create_Summary
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Document_Improver import Model__Response_Format__Json_Prompt__Document_Improver, Json_Prompt__Document_Improver
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Validate_Summary  import Model__Response_Format__Json_Prompt__Validate_Summary, Json_Prompt__Validate_Summary
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Email_Generator   import Model__Response_Format__Json_Prompt__Email_Generator, Json_Prompt__Email_Generator
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Form_Generator    import Model__Response_Format__Json_Prompt__Form_Generator, Json_Prompt__Form_Generator
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Graph_Extractor   import Model__Response_Format__Json_Prompt__Graph_Extractor, Json_Prompt__Graph_Extractor, GraphResponse
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Mermaid_Generator import Model__Response_Format__Json_Prompt__Mermaid_Generator, Json_Prompt__Mermaid_Generator
from osbot_utils.helpers.Random_Guid import Random_Guid
from osbot_utils.utils.Status import status_ok, status_error


class Model__Fast_API__Create_Summary(BaseModel):
    target_text: str

class Model__Fast_API__Document_Improver(BaseModel):
    current_content: str
    improvement_request: str

class Model__Fast_API__Validate_Summary(BaseModel):
    original_text: str
    summary: str

class Model__Fast_API__Email_Generator(BaseModel):
    email_requirements: str
    context: Optional[Dict] = None

class Model__Fast_API__Form_Generator(BaseModel):
    form_requirements: str

class Model__Fast_API__Graph_Extractor(BaseModel):
    content: str

class Model__Fast_API__Mermaid_Generator(BaseModel):
    graph: GraphResponse
    style_request: Optional[str] = ""


class Routes__Json_Prompt(Fast_API_Routes):
    tag : str = 'json-prompt'

    def invoke_prompt(self, target_class: Type, target_method: str, method_kwargs) -> Dict:
        try:
            response = getattr(target_class(), target_method)(**method_kwargs)

            data = { 'json_prompt_id' : Random_Guid()                 ,
                     'duration'       : response.get('duration'       ),
                     'llm_model'      : response.get('llm_model'      ),
                     'response_json'  : response.get('response_json'  ),
                     'response_schema': response.get('response_schema'),
                     'seed'           : response.get('seed'           ),
                     'temperature'    : response.get('temperature'    ),
                     'timestamp'      : response.get('timestamp'      ),
                     'tokens'         : response.get('tokens'         ),
            }
            return status_ok(message="Json Prompt created ok", data=data)
        except Exception as exception:
            return status_error(message="Failed to create Json Prompt", error=f'{exception}')

    def create_summary(self, request: Model__Fast_API__Create_Summary):
        target_class  = Json_Prompt__Create_Summary
        target_method = 'create_summary'
        target_kwargs = dict(target_text=request.target_text)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def improve_document(self, request: Model__Fast_API__Document_Improver):
        target_class  = Json_Prompt__Document_Improver
        target_method = 'improve_document'
        target_kwargs = dict(current_content     = request.current_content,
                             improvement_request = request.improvement_request)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def validate_summary(self, request: Model__Fast_API__Validate_Summary):
        target_class  = Json_Prompt__Validate_Summary
        target_method = 'validate_summary'
        target_kwargs = dict(original_text = request.original_text,
                             summary      = request.summary)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def generate_email(self, request: Model__Fast_API__Email_Generator):
        target_class  = Json_Prompt__Email_Generator
        target_method = 'generate_email'
        target_kwargs = dict(email_requirements = request.email_requirements,
                             context           = request.context)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def generate_form(self, request: Model__Fast_API__Form_Generator):
        target_class  = Json_Prompt__Form_Generator
        target_method = 'generate_form'
        target_kwargs = dict(form_requirements = request.form_requirements)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def extract_graph(self, request: Model__Fast_API__Graph_Extractor):
        target_class  = Json_Prompt__Graph_Extractor
        target_method = 'extract_graph'
        target_kwargs = dict(content = request.content)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def generate_mermaid(self, request: Model__Fast_API__Mermaid_Generator):
        target_class  = Json_Prompt__Mermaid_Generator
        target_method = 'convert_to_mermaid'
        target_kwargs = dict(graph         = request.graph,
                             style_request = request.style_request)
        result        = self.invoke_prompt(target_class, target_method, target_kwargs)
        return result

    def setup_routes(self):
        self.add_route_post(self.create_summary  )
        self.add_route_post(self.improve_document)
        self.add_route_post(self.validate_summary)
        self.add_route_post(self.generate_email  )
        self.add_route_post(self.generate_form   )
        self.add_route_post(self.extract_graph   )
        self.add_route_post(self.generate_mermaid)