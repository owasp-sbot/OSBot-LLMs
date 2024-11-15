from unittest                                                                import TestCase
from pydantic._internal._model_construction                                  import ModelMetaclass
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                  import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Document_Improver import Json_Prompt__Document_Improver, Model__Response_Format__Json_Prompt__Document_Improver

class test_Json_Prompt__Document_Improver(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.document_improver = Json_Prompt__Document_Improver()

    def test__init__(self):
        with self.document_improver as _:
            assert _.response_format is Model__Response_Format__Json_Prompt__Document_Improver
            assert type(_.response_format) is ModelMetaclass
            assert type(_.prompt_to_json) is Prompt_To_Json__Open_AI

    def test_improve_document(self):
        original_content = """# Data Security Best Practices
1. Use strong passwords
2. Enable 2FA
3. Encrypt sensitive data
4. Regular backups
5. Update software"""

        improvement_request = "Add implementation details for each practice and include a section on network security"

        with self.document_improver as _:
            response = _.improve_document(original_content, improvement_request)
            #pprint(response)

            assert response['response_parsed'].status == "success"
            assert len(response['response_parsed'].document.changes) > 0
            assert "network security" in response['response_parsed'].document.new_version.lower()
            assert response['response_parsed'].document.summary != ""

    def test_improve_document__formatting(self):
        original_content = """Problem Statement
the system needs to handle user authentication and authorization
System should process real-time data
must support multiple user roles"""

        improvement_request = "Fix formatting and improve writing style"

        with self.document_improver as _:
            response = _.improve_document(original_content, improvement_request)
            #pprint(response)

            assert response['response_parsed'].status == "success"
            assert any(change.type == "formatting" for change in response['response_parsed'].document.changes)
            assert "Problem Statement" in response['response_parsed'].document.new_version