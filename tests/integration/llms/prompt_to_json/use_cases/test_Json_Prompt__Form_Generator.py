from unittest                                                               import TestCase
from pydantic._internal._model_construction                                 import ModelMetaclass
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI                 import Prompt_To_Json__Open_AI
from osbot_llms.llms.prompt_to_json.use_cases.Json_Prompt__Form_Generator   import Json_Prompt__Form_Generator,Model__Response_Format__Json_Prompt__Form_Generator


class test_Json_Prompt__Form_Generator(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.form_generator = Json_Prompt__Form_Generator()

    def test__init__(self):
        with self.form_generator as _:
            assert _.response_format is Model__Response_Format__Json_Prompt__Form_Generator
            assert type(_.response_format) is ModelMetaclass
            assert type(_.prompt_to_json) is Prompt_To_Json__Open_AI

    def test_generate_form(self):
        form_requirements = """Create a contact form with:
        - Name (required)
        - Email (required)
        - Phone (optional)
        - Message (required)
        - Preferred contact method (radio: email/phone)
        """

        with self.form_generator as _:
            response = _.generate_form(form_requirements)

            assert response['response_parsed'].status == "success"
            assert len(response['response_parsed'].form.sections) > 0
            assert "contact" in response['response_parsed'].form.title.lower()

            # Verify required fields are present
            fields = [field for section in response['response_parsed'].form.sections
                     for field in section.fields]
            field_names = [field.name for field in fields]

            assert 'name' in field_names
            assert 'email' in field_names
            assert 'message' in field_names

            # Verify radio buttons for contact method
            contact_method_field = next(
                (field for field in fields if 'contact' in field.name.lower()),
                None
            )
            assert contact_method_field is not None
            assert contact_method_field.type == 'radio'
            assert len(contact_method_field.options) == 2

    def test_generate_form__complex(self):
        form_requirements = """Create a job application form with:
        - Personal Information section
        - Work Experience section (repeatable)
        - Education History section
        - Skills and Qualifications
        """

        with self.form_generator as _:
            response = _.generate_form(form_requirements)

            assert response['response_parsed'].status == "success"
            assert len(response['response_parsed'].form.sections) >= 4  # At least 4 sections
            assert "job application" in response['response_parsed'].form.title.lower()

            # Verify sections are present
            section_titles = [section.title.lower() for section in response['response_parsed'].form.sections
                            if section.title]
            assert any('personal' in title for title in section_titles)
            assert any('experience' in title for title in section_titles)
            assert any('education' in title for title in section_titles)
            assert any('skills' in title for title in section_titles)