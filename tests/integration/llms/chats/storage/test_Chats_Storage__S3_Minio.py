from osbot_utils.helpers.Random_Guid                            import Random_Guid
from osbot_utils.utils.Misc import random_text, list_set
from osbot_utils.utils.Objects                                  import dict_to_obj
from osbot_llms.OSBot_LLMs__Server_Config                       import osbot_llms__server_config
from osbot_llms.OSBot_LLMs__Shared_Objects                      import osbot_llms__shared_objects
from osbot_llms.llms.storage.Chats_Storage__S3_Minio            import Chats_Storage__S3_Minio
from osbot_llms.models.LLMs__Chat_Completion                    import LLMs__Chat_Completion
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads   import TestCase__S3_Minio__Temp_Chat_Threads


class test_Chats_Storage__S3(TestCase__S3_Minio__Temp_Chat_Threads):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.chats_storage__s3_minio = Chats_Storage__S3_Minio()

    def test_s3_log_requests(self):
        assert self.chats_storage__s3_minio.s3_log_requests()    == osbot_llms__server_config.s3_log_requests

    def test_s3_db_chat_threads(self):
        assert self.chats_storage__s3_minio.s3_db_chat_threads() == osbot_llms__shared_objects.s3_db_chat_threads()

    def test_save_user_request(self):
        user_prompt         = random_text('an-user-prompt')
        request_id          = Random_Guid()
        chat_thread_id      = Random_Guid()
        kwargs              = dict(chat_thread_id = chat_thread_id,
                                   user_prompt    = user_prompt   )
        llm_chat_completion = LLMs__Chat_Completion(**kwargs)

        result = dict_to_obj(self.chats_storage__s3_minio.save_user_request(llm_chat_completion, request_id))

        assert result.llm_request_id == request_id
        assert request_id            in result.public_chat_id
        assert request_id            in result.s3_key
        assert result.s3_key.endswith(f'{chat_thread_id}/{request_id}/user-request.json.gz')

        with self.chats_storage__s3_minio.s3_db_chat_threads() as _:
            s3_file_contents = dict_to_obj(_.s3_file_data(result.s3_key))

            assert s3_file_contents.request_id                      == request_id
            assert s3_file_contents.chat_thread_id                  == chat_thread_id
            assert s3_file_contents.llm_request_id                  == request_id
            assert s3_file_contents.llm_chat_completion.images      == []
            assert s3_file_contents.llm_chat_completion.temperature == '0'
            assert s3_file_contents.llm_chat_completion.seed        == 42
            assert s3_file_contents.llm_chat_completion.user_prompt == user_prompt

    def test_save_user_response(self):
        request_id          = Random_Guid()
        llm_chat_completion = LLMs__Chat_Completion()
        result              = dict_to_obj(self.chats_storage__s3_minio.save_user_response(llm_chat_completion, request_id))

        assert result.status              == 'ok'
        assert result.data.llm_request_id == request_id
        from osbot_utils.utils.Dev import pprint
        assert result.data.s3_key.endswith(f'{request_id}/user-response.json.gz')


