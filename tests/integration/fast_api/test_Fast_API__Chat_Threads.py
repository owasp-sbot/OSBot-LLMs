import pytest

from osbot_utils.helpers.Random_Guid                            import Random_Guid
from osbot_utils.utils.Env                                      import in_github_action
from osbot_utils.utils.Json                                     import json_load
from osbot_utils.utils.Misc                                     import is_guid, list_set
from osbot_llms.OSBot_LLMs__Server_Config                       import osbot_llms__server_config
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads            import CHAT__REQUEST_TYPE__USER_REQUEST, CHAT__REQUEST_TYPE__USER_RESPONSE
from osbot_llms.fast_api.routes.Routes__Chat                    import HEADER_NAME__CHAT_ID, HEADER_NAME__CHAT_THREAD_ID
from osbot_llms.models.LLMs__Chat_Completion                    import LLMs__Chat_Completion
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads   import TestCase__S3_Minio__Temp_Chat_Threads
from tests.llm_fast_api__for_tests                              import llm_fast_api__client


class test_Fast_API__Chat_Threads(TestCase__S3_Minio__Temp_Chat_Threads):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client             = llm_fast_api__client
        osbot_llms__server_config.s3_log_requests = True

    def test__setUpClass(self):
        with self.s3_db_chat_threads as _:
            assert _.using_minio() is True
            assert _.bucket_exists() is True

    def test__prompt_with_system__stream__save_chat_completion__user_request(self):
        if in_github_action():
            pytest.skip("Test need OpenAI key to run")
        chat_thread_id      = Random_Guid()
        user_prompt         = 'what is 40+2'
        user_data           = { "session_id"        : "user__session_id",  # this simulates the request sent to /api/llms/chat/completion
                                "selected_platform" : "OpenAI (Paid)"     ,
                                "selected_provider" : "OpenAI"            ,
                                "selected_model"    : "gpt-3.5-turbo"     }

        llm_chat_completion = LLMs__Chat_Completion(user_prompt=user_prompt, chat_thread_id=chat_thread_id,
                                                    user_data=user_data)
        json_data           = json_load(llm_chat_completion.model_dump_json())
        response            = self.client.post('chat/completion', json=json_data)

        assert response.status_code == 200
        assert '42' in response.text

        assert list_set(response.headers) == [ 'content-type'             ,
                                               'fast-api-request-id'      ,
                                               HEADER_NAME__CHAT_ID       ,
                                               HEADER_NAME__CHAT_THREAD_ID]

        request_id      = response.headers.get('fast-api-request-id')
        when_str        = self.s3_db_chat_threads.s3_key_generator.path__for_date_time__now_utc()
        server_name     = self.s3_db_chat_threads.server_name
        s3_folder_chats = f'chat-threads/{server_name}/{when_str}/{chat_thread_id}/{request_id}/'

        assert is_guid(request_id)

        chat_request_file =  f'{CHAT__REQUEST_TYPE__USER_REQUEST }.json.gz'
        chat_response_file = f'{CHAT__REQUEST_TYPE__USER_RESPONSE}.json.gz'
        assert self.s3_db_chat_threads.s3_folder_files(s3_folder_chats) == [chat_request_file, chat_response_file]