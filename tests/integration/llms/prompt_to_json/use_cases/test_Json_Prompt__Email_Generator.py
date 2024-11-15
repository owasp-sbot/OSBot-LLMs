from unittest                                                               import TestCase
from pydantic._internal._model_construction                                 import ModelMetaclass
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                 import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Email_Generator  import Json_Prompt__Email_Generator,Model__Response_Format__Json_Prompt__Email_Generator


class test_Json_Prompt__Email_Generator(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.email_generator = Json_Prompt__Email_Generator()

    def test__init__(self):
        with self.email_generator as _:
            assert _.response_format is Model__Response_Format__Json_Prompt__Email_Generator
            assert type(_.response_format) is ModelMetaclass
            assert type(_.prompt_to_json) is Prompt_To_Json__Open_AI

    def test_generate_email__simple(self):
        email_requirements = """Write a professional email to schedule a team meeting
        - Topic: Q4 Planning
        - Preferred times: Tuesday or Thursday next week
        - Duration: 2 hours
        - Include agenda points
        """

        with self.email_generator as _:
            response = _.generate_email(email_requirements)
            #pprint(response)
            assert response['response_parsed'].status == "success"
            assert "Q4 Planning" in response['response_parsed'].email.subject
            assert response['response_parsed'].email.tone == "professional"
            assert "agenda" in response['response_parsed'].email.body.lower()

    def test_generate_email__with_context(self):
        email_requirements = """Write a follow-up email about the project delay"""

        context = {
            "previous_communication": "Last week we discussed the timeline issues with the mobile app development",
            "current_situation": "Backend integration is taking longer than expected",
            "project_impact": "Launch date needs to be pushed by 2 weeks",
            "team_members": ["john@example.com", "sarah@example.com"],
            "stakeholders": ["michael@example.com"]
        }

        with self.email_generator as _:
            response = _.generate_email(email_requirements, context)
            #pprint(response)
            assert response['response_parsed'].status == "success"
            assert "delay" in response['response_parsed'].email.subject.lower()
            assert all(member in response['response_parsed'].email.recipients
                      for member in context["team_members"])
            assert "backend" in response['response_parsed'].email.body.lower()
            assert "weeks" in response['response_parsed'].email.body