from pydantic                                               import BaseModel
from typing                                                 import List, Literal
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI
from osbot_utils.base_classes.Type_Safe                     import Type_Safe

class Node(BaseModel):
    id: str
    type: Literal['concept', 'entity', 'action', 'property', 'event']
    content: str

class Edge(BaseModel):
    source: str
    target: str
    type: Literal[
        'contains', 'contained_by',
        'requires', 'required_by',
        'triggers', 'triggered_by',
        'describes', 'described_by',
        'precedes', 'follows',
        'connects_to', 'connected_from',
        'creates', 'created_by',
        'modifies', 'modified_by'
    ]
    weight: float

class GraphResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    summary: str

class Model__Response_Format__Json_Prompt__Graph_Extractor(BaseModel):
    graph: GraphResponse
    status: Literal['success', 'error', 'partial_success', 'no_structure_found', 'validation_failed']

    model_config = {
        "json_schema_extra": {
            "required": ["graph", "status"]
        }
    }



class Json_Prompt__Graph_Extractor(Type_Safe):
    prompt_to_json : Prompt_To_Json__Open_AI
    response_format: type = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_format = Model__Response_Format__Json_Prompt__Graph_Extractor

    def extract_graph(self, content: str):
        with self.prompt_to_json as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(self.response_format)
            _.add_message__system(self.system_prompt())
            _.add_message__user(f"Content to analyze:\n{content}")
            return _.invoke()

    def system_prompt(self):
        return """Extract a knowledge graph from the content:
1. Identify key concepts, entities, actions, properties and events as nodes
2. Establish relationships between nodes as edges
3. Assign appropriate relationship types and weights
5. Ensure graph connectivity and meaningful structure
6. Don't add more information, mappings or data than what's in the content

Focus on creating a graph that captures:
- Core concepts and their relationships
- Hierarchical structures
- Sequential flows
- Dependencies
- Properties and attributes"""