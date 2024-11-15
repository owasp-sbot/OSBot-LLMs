from pydantic                                                               import BaseModel
from typing                                                                 import Literal, Optional
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                 import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Graph_Extractor  import GraphResponse
from osbot_utils.base_classes.Type_Safe                                     import Type_Safe

class MermaidResponse(BaseModel):
    mermaid      : str
    status       : Literal['success', 'error']
    error_message: Optional[str] = None

class Model__Response_Format__Json_Prompt__Mermaid_Generator(BaseModel):
    response: MermaidResponse

class Json_Prompt__Mermaid_Generator(Type_Safe):
    prompt_to_json: Prompt_To_Json__Open_AI
    response_format: type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Mermaid_Generator

    def convert_to_mermaid(self, graph: GraphResponse, style_request: str = ""):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())
            _.add_message__user(f"""Graph Structure:
Nodes: {[{'id': n.id, 'type': n.type, 'content': n.content} for n in graph.nodes]}
Edges: {[{'source': e.source, 'target': e.target, 'type': e.type} for e in graph.edges]}

Style Request: {style_request}""")
            return _.invoke()

    def system_prompt(self):
        return """Create a Mermaid graph diagram that:
1. Uses appropriate node shapes based on node types
2. Creates clear directional relationships
3. Maintains readability and visual hierarchy
4. Uses descriptive edge styles for different relationship types
5. Implements subgraphs for grouped elements if needed

Node Type Styling:
- concept: ((node))
- entity: [node]
- action: {node}
- property: [[node]]
- event: >node]

Edge Type Guidelines:
- contains/contained_by: -- 
- requires/required_by: ==>
- triggers/triggered_by: -->
- describes/described_by: -.-
- precedes/follows: -->"""