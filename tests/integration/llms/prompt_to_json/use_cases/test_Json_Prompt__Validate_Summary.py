from unittest                                                               import TestCase
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                 import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Validate_Summary import Json_Prompt__Validate_Summary, Model__Response_Format__Json_Prompt__Validate_Summary

class test_Json_Prompt__Validate_Summary(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.validate_summary = Json_Prompt__Validate_Summary()

    def test__init__(self):
        with self.validate_summary as _:
            assert _.response_format       is Model__Response_Format__Json_Prompt__Validate_Summary
            assert type(_.prompt_to_json ) is Prompt_To_Json__Open_AI

    def test_validate_summary__valid(self):
        original_text = """A recent study of coral reefs in the Pacific Ocean has documented significant changes in biodiversity. Researchers observed a 15% decline in fish species and a 23% reduction in coral coverage over the past decade. The primary factors identified were rising water temperatures and increased ocean acidification."""
        valid_summary = """A Pacific Ocean coral reef study found 15% fish species decline and 23% coral coverage reduction over a decade, attributed to water temperature rise and ocean acidification."""
        with self.validate_summary as _:
            response = _.validate_summary(original_text, valid_summary)
            #pprint(response)
            assert response['response_parsed'].is_valid == True
            assert response['response_parsed'].confidence > 0.8
            assert response['response_parsed'].quality > 0.7
            assert len(response['response_parsed'].issues_found) == 0

    def test_validate_summary__invalid(self):
        original_text = """A recent study of coral reefs in the Pacific Ocean has documented significant changes in biodiversity. Researchers observed a 15% decline in fish species and a 23% reduction in coral coverage over the past decade. The primary factors identified were rising water temperatures and increased ocean acidification."""
        invalid_summary = """Global warming has devastated Pacific Ocean coral reefs, with studies showing massive declines in marine life of up to 50%. Scientists warn this could lead to ecosystem collapse by 2050 if immediate action isn't taken to reduce carbon emissions."""


        with self.validate_summary as _:
            response = _.validate_summary(original_text, invalid_summary)
            #pprint(response)
            assert response['response_parsed'].is_valid == False
            assert len(response['response_parsed'].issues_found) > 0