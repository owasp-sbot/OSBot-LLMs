from unittest                                                                import TestCase
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Graph_Extractor   import GraphResponse, Node, Edge
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Mermaid_Generator import Json_Prompt__Mermaid_Generator

class test_Json_Prompt__Mermaid_Generator(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.mermaid_generator = Json_Prompt__Mermaid_Generator()

    def test_mermaid_generator(self):
        graph = GraphResponse(nodes  = [ Node(id='auth', type='concept', content='Authentication'),
                                         Node(id='cred', type='entity', content='Credentials'),
                                         Node(id='val', type='action', content='Validate'),
                                         Node(id='sess', type='event', content='Session Created')],
                              edges  = [ Edge(source='cred', target='val', type='required_by' , weight=0.5),
                                         Edge(source='val', target='sess', type='triggers'    , weight=0.5)],
                              summary="Auth flow")

        # Test default style
        with self.mermaid_generator as _:
            response = _.convert_to_mermaid(graph)
            assert response['response_parsed'].response.status == "success"
            assert "graph TD" in response['response_parsed'].response.mermaid
            assert "Authentication" in response['response_parsed'].response.mermaid

        # Test with custom style request
        with self.mermaid_generator as _:
            response = _.convert_to_mermaid(graph, "Use LR direction and group auth steps")
            assert "graph LR" in response['response_parsed'].response.mermaid
            assert "subgraph" in response['response_parsed'].response.mermaid.lower()
