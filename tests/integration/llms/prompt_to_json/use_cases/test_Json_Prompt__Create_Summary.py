from unittest                                                               import TestCase
from pydantic._internal._model_construction                                 import ModelMetaclass
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                 import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Create_Summary   import Json_Prompt__Create_Summary, Model__Response_Format__Json_Prompt__Create_Summary

class test_Json_Prompt__Create_Summary(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.create_summary = Json_Prompt__Create_Summary()

    def test__init__(self):
        with self.create_summary as _:
            assert _.response_format       is Model__Response_Format__Json_Prompt__Create_Summary
            assert type(_.response_format) is ModelMetaclass
            assert type(_.prompt_to_json ) is Prompt_To_Json__Open_AI

    def test_create_summary(self):
        with self.create_summary as _:
            response = _.create_summary(TEST_CONTENT__GDPR__SMALL)
            assert 'GDPR' in response.get('response_parsed').keywords
            assert 'GDPR' in response.get('response_parsed').summary
            #pprint(response)


TEST_CONTENT__GDPR__SMALL = """
## GDPR Compliance Guidelines
The GDPR outlines essential principles and requirements for processing personal data, emphasizing lawfulness, fairness, and transparency. Organizations must obtain explicit consent, maintain records, implement privacy measures, report breaches, conduct impact assessments, and appoint a DPO if necessary. Individuals have several rights, including access, rectification, erasure, and portability. Technical measures such as encryption, security testing, and access controls are mandatory. Documentation is required for various processes, and international data transfers must follow specific guidelines."""

