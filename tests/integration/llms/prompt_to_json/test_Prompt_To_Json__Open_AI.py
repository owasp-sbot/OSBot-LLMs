from unittest                                               import TestCase
from pydantic                                               import BaseModel
from osbot_llms.llms.prompt_to_json.Prompt_To_Json__Open_AI import Prompt_To_Json__Open_AI



class test_Prompt_To_Json__Open_AI(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        cls.prompt_to_json = Prompt_To_Json__Open_AI()

    def test_invoke(self):
        class CalendarEvent(BaseModel):
            name: str
            date: str
            participants: list[str]
            action: str

        with self.prompt_to_json  as _:
            _.set_model__gpt_4o_mini()
            _.set_response_format(CalendarEvent)
            _.add_message__system("Extract the event information."                      )
            _.add_message__user  ("Alice and Bob are going to a science fair on Friday.")

            response = _.invoke()

            expected_content = { 'action'      : 'Attend'      ,
                                 'date'        : 'Friday'      ,
                                 'name'        : 'Science Fair',
                                 'participants': ['Alice', 'Bob']}
            assert response == dict(content  = expected_content                 ,
                                    model    = CalendarEvent(**expected_content),
                                    tokens   = 124                              )
