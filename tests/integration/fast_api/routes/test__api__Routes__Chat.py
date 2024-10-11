from osbot_utils.helpers.Random_Guid                            import Random_Guid
from osbot_utils.utils.Json                                     import json_load
from osbot_utils.utils.Misc                                     import list_set
from osbot_llms.OSBot_LLMs__Server_Config                       import osbot_llms__server_config
from osbot_llms.OSBot_LLMs__Shared_Objects                      import osbot_llms__shared_objects
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads            import CHAT__REQUEST_TYPE__USER_RESPONSE
from osbot_llms.fast_api.routes.Routes__Chat                    import HEADER_NAME__CHAT_THREAD_ID, HEADER_NAME__CHAT_ID, \
    HEADER_NAME__CHAT_PLATFORM, HEADER_NAME__CHAT_PROVIDER, HEADER_NAME__CHAT_MODEL
from osbot_llms.models.LLMs__Chat_Completion                    import LLMs__Chat_Completion
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads   import TestCase__S3_Minio__Temp_Chat_Threads
from tests.llm_fast_api__for_tests                              import llm_fast_api__client

class test__api__Routes__Chat(TestCase__S3_Minio__Temp_Chat_Threads):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = llm_fast_api__client
        cls.s3_db_chat_threads = osbot_llms__shared_objects.s3_db_chat_threads()
        osbot_llms__server_config.s3_log_requests = True

    def test__completion__save_chat_completion__user_request(self):
        chat_thread_id      = Random_Guid()
        user_prompt         = 'what is 40+2'
        user_data           = { "session_id"        : "user__session_id",  # this simulates the request sent to /api/llms/chat/completion
                                "selected_platform" : "Groq (Free)"     ,
                                "selected_provider" : "1. Meta"         ,
                                "selected_model"    : "llama3-70b-8192" }
        server_name         = osbot_llms__server_config.server_name
        llm_chat_completion = LLMs__Chat_Completion(user_prompt=user_prompt, chat_thread_id=chat_thread_id, user_data=user_data)
        json_data           = llm_chat_completion.json()
        response            = self.client.post('/chat/completion', json=json_data)      # submit chat request
        request_id          = response.headers.get('fast-api-request-id')
        when_str            = self.s3_db_chat_threads.s3_key_generator.path__for_date_time__now_utc()
        request_type        = CHAT__REQUEST_TYPE__USER_RESPONSE
        s3_folder           = f'chat-threads/{server_name}/{when_str}/{chat_thread_id}/{request_id}/'
        s3_key              = f'{s3_folder}{request_type}.json.gz'
        file_data           = self.s3_db_chat_threads.s3_file_data(s3_key)

        assert list_set(dict(response.headers))                   == sorted([ 'content-type', 'fast-api-request-id',
                                                                              HEADER_NAME__CHAT_ID, HEADER_NAME__CHAT_THREAD_ID,
                                                                              HEADER_NAME__CHAT_PLATFORM, HEADER_NAME__CHAT_PROVIDER, HEADER_NAME__CHAT_MODEL])
        assert self.s3_db_chat_threads.s3_folder_files(s3_folder) == [ 'user-request.json.gz', 'user-response.json.gz']
        assert list_set(file_data)                                == [ 'chat_thread_id', 'histories', 'images', 'llm_answer',
                                                                       'llm_model', 'llm_platform', 'llm_provider', 'max_tokens',
                                                                       'seed', 'stream', 'system_prompts', 'temperature',
                                                                       'user_data', 'user_prompt']

    def test__view(self):
        chat_thread_id = Random_Guid()
        user_prompt    = 'this is a user prompt'
        s3_key         = self.s3_key__new_chat(chat_thread_id=chat_thread_id, user_prompt=user_prompt)
        chat_id = '/'.join(s3_key.split('/')[2:6])
        url_get        = f'/chat/view?chat_id={chat_id}'
        response       = self.client.get(url_get)

        assert response.status_code == 200
        assert response.json() == { 'chat_thread_id': chat_thread_id,
                                    'histories': None,
                                    'images': [],
                                    'llm_answer': None,
                                    'llm_model': None,
                                    'llm_platform': None,
                                    'llm_provider': None,
                                    'max_tokens': None,
                                    'seed': 42,
                                    'stream': True,
                                    'system_prompts': None,
                                    'temperature': 0.0,
                                    'user_data': None,
                                    'user_prompt': user_prompt}

