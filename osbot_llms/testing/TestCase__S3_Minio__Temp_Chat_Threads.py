from unittest                                            import TestCase
from osbot_aws.testing.Temp__Random__AWS_Credentials     import Temp__Random__AWS_Credentials
from osbot_utils.helpers.Random_Guid                     import Random_Guid
from osbot_llms.OSBot_LLMs__Server_Config                import osbot_llms__server_config
from osbot_llms.OSBot_LLMs__Shared_Objects               import osbot_llms__shared_objects
from osbot_llms.backend.s3_minio.S3_DB_Base              import ENV_NAME__USE_MINIO_AS_S3
from osbot_llms.models.LLMs__Chat_Completion             import LLMs__Chat_Completion


class TestCase__S3_Minio__Temp_Chat_Threads(TestCase):

    @classmethod
    def setUpClass(cls):
        osbot_llms__server_config.s3_log_requests = True       # set value of s3_log_requests

        cls.extra_env_vars        = {ENV_NAME__USE_MINIO_AS_S3: 'True'}
        cls.random_aws_creds      = Temp__Random__AWS_Credentials(env_vars=cls.extra_env_vars).set_vars()
        cls.s3_db_chat_threads    = osbot_llms__shared_objects.s3_db_chat_threads   (reload_cache=True)
        cls.server_name           = osbot_llms__server_config.server_name

        with cls.s3_db_chat_threads as _:                       # setup bucket for chat_threads
            assert _.using_minio() is True                      # confirm we are using Minio
            assert _.setup      () is _                         # this will create the temp bucket
            assert _.bucket_exists() is True

    @classmethod
    def tearDownClass(cls):
        with cls.s3_db_chat_threads as _:                       # delete temp bucket for chat_threads
            assert _.using_minio() is True
            assert _.bucket_delete_all_files()
            assert _.bucket_delete() is True

        cls.random_aws_creds.restore_vars()

        osbot_llms__server_config.s3_log_requests = False      # restore value of s3_log_requests

    def s3_key__new_chat(self, **kwargs):
        request_id = Random_Guid()
        llm_chat_completion = LLMs__Chat_Completion(**kwargs)
        response = self.s3_db_chat_threads.save_chat_completion__user_response(llm_chat_completion, request_id)
        return response.get('data').get('s3_key')

    def s3_key__new_chats(self, count=5, **kwargs):
        s3_keys = []
        for i in range(count):
            s3_keys.append(self.s3_key__new_chat(**kwargs))
        return s3_keys