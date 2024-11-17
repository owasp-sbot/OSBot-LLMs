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

    #note: in 4o , there is weird behaviour where using 'add 1 paragraph to summary' will make it go into a spin and either timeout or fail with a 'reached max 16k tokens' error
    # def test__bug__request_that_was_timing_out_in_browser(self):
    #     data = {"current_content":"##  GDPR Compliance Guidelines\n\nThe GDPR outlines essential principles and requirements for processing personal data, "
    #                               "emphasizing lawfulness, fairness, and transparency. Organizations must obtain explicit consent, maintain records, "
    #                               "implement privacy measures, report breaches, conduct impact assessments, and appoint a DPO if necessary. "
    #                               "Individuals have several rights, including access, rectification, erasure, and portability. "
    #                               "Technical measures such as encryption, security testing, and access controls are mandatory. "
    #                               "Documentation is required for various processes, and international data transfers must follow specific guidelines.\n\n"
    #                               "###  Additional Considerations\n\n1. "
    #                               "**Data Minimization**: Organizations should only collect personal data that is necessary for the specified purpose.\n2. "
    #                               "**Purpose Limitation**: Personal data should only be collected for specified, legitimate purposes and not further processed in a manner incompatible with those purposes.\n3. "
    #                               "**Data Protection by Design and by Default**: Organizations should implement appropriate technical and organizational measures to ensure that, by default, only personal data necessary for each specific purpose is processed.\n4. "
    #                               "**Data Breach Notification**: Organizations must notify the relevant supervisory authority of a data breach within 72 hours of becoming aware of it, unless the breach is unlikely to result in a risk to the rights and freedoms of individuals.\n5. "
    #                               "**Data Subject Rights**: Organizations must ensure that individuals can easily exercise their rights under the GDPR, including the right to access their data, request corrections, and object to processing.",
    #         "improvement_request":"add 1 paragraph to summary" }
    #     original_content    = data.get('current_content')
    #     improvement_request = data.get('improvement_request')
    #     with self.document_improver as _:
    #         response = _.improve_document(original_content, improvement_request)
    #         pprint(response)
