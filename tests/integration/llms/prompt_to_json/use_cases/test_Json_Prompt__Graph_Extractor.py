from unittest                                                               import TestCase
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Graph_Extractor  import Json_Prompt__Graph_Extractor

class test_Json_Prompt__Graph_Extractor(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.graph_extractor = Json_Prompt__Graph_Extractor()

    def test_extract_graph__process_flow(self):
        content = """User Authentication Process:
1. User submits credentials
2. System validates input
3. If valid, creates session
4. Else, returns error"""

        with self.graph_extractor as _:
            response = _.extract_graph(content)
            #pprint(response)

            assert response['response_parsed'].status == "success"
            nodes = response['response_parsed'].graph.nodes
            edges = response['response_parsed'].graph.edges

            assert len(nodes) >= 4  # Should have nodes for each step
            assert len(edges) >= 3  # Should have connections between steps
            #assert any(edge.type == 'requires' for edge in edges)
            assert any(node.type == 'action'   for node in nodes)

    def test_extract_graph__concept_map(self):
        content = """A cell contains organelles:
- Mitochondria produces energy
- Nucleus stores DNA
- Ribosomes make proteins"""

        with self.graph_extractor as _:
            response = _.extract_graph(content)
            #pprint(response)

            assert response['response_parsed'].status == "success"
            graph = response['response_parsed'].graph

            # Verify node types and relationships
            cell_nodes = [n for n in graph.nodes if 'cell' in n.content.lower()]
            assert len(cell_nodes) == 1

            # Check for contains/contained_by relationships
            contains_edges = [e for e in graph.edges if e.type == 'contains']
            assert len(contains_edges) >= 3

    # todo: find a better way to do this
    # def test_extract_graph__error_handling(self):
    #     with self.graph_extractor as _:
    #         response = _.extract_graph("")
    #         pprint(response)
    #         assert response['response_parsed'].status == "no_structure_found"