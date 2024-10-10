from osbot_aws.AWS_Config                                     import aws_config
from osbot_utils.utils.Misc                                   import list_set

from osbot_llms.backend.s3_minio.S3_DB_Base import S3_DB_BASE__BUCKET_NAME__PREFIX
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads          import S3_DB__Chat_Threads
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads import TestCase__S3_Minio__Temp_Chat_Threads

class test_TestCase__S3_Minio__Temp_Chat_Threads(TestCase__S3_Minio__Temp_Chat_Threads):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        assert cls.s3_db_chat_threads.bucket_exists()    is False

    def test__setUpClass(self):
        assert list_set(self.extra_env_vars)             == [ 'AWS_ACCESS_KEY_ID'           ,
                                                              'AWS_ACCOUNT_ID'              ,
                                                              'AWS_DEFAULT_REGION'          ,
                                                              'AWS_SECRET_ACCESS_KEY'       ,
                                                              'USE_MINIO_AS_S3'             ]
        assert self.random_aws_creds.original_env_vars   == { 'AWS_ACCESS_KEY_ID'    : None ,
                                                              'AWS_ACCOUNT_ID'       : None ,
                                                              'AWS_DEFAULT_REGION'   : None ,
                                                              'AWS_SECRET_ACCESS_KEY': None ,
                                                              'USE_MINIO_AS_S3'      : None }
        assert self.server_name                          == 'osbot-llms'
        assert type(self.s3_db_chat_threads)             is S3_DB__Chat_Threads
        assert self.s3_db_chat_threads.bucket_exists()   is True
        assert aws_config.account_id()                   == self.random_aws_creds.env_vars['AWS_ACCOUNT_ID']
        assert self.s3_db_chat_threads.s3_bucket()       == f'{S3_DB_BASE__BUCKET_NAME__PREFIX}-{aws_config.account_id()}-chat-threads'
        assert self.s3_db_chat_threads.use_minio         is True
        assert self.s3_db_chat_threads.server_name       == 'osbot-llms'


