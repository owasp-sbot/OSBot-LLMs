from osbot_aws.AWS_Config                                               import aws_config
from osbot_utils.helpers.Random_Guid                                    import Random_Guid
from osbot_utils.utils.Misc                                             import random_text, is_guid
from osbot_llms.backend.s3_minio.S3_DB_Base                             import S3_DB_BASE__BUCKET_NAME__PREFIX, S3_DB_BASE__BUCKET_NAME__SUFFIX, S3_DB_BASE__SERVER_NAME
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads                    import S3_DB__Chat_Threads, S3_BUCKET_SUFFIX__CHAT_THREADS
from osbot_llms.backend.s3_minio.S3__Key__Chat_Thread                   import S3__Key__Chat_Thread
from osbot_llms.models.LLMs__Chat_Completion                            import LLMs__Chat_Completion
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads           import TestCase__S3_Minio__Temp_Chat_Threads


class test_S3_DB__Chat_Threads(TestCase__S3_Minio__Temp_Chat_Threads):

    def test_init(self):
        with S3_DB__Chat_Threads() as _:
            assert type(_.s3_key_generator) is S3__Key__Chat_Thread
            assert _.json() == { 'bucket_name__insert_account_id': True,
                                 'bucket_name__prefix'           : S3_DB_BASE__BUCKET_NAME__PREFIX,
                                 'bucket_name__suffix'           : S3_BUCKET_SUFFIX__CHAT_THREADS ,
                                 's3_key_generator'              : { 'root_folder'       : 'chat-threads'   ,
                                                                     's3_path_block_size': 5                ,
                                                                     'save_as_gz'        : True             ,
                                                                     'server_name'       : 'unknown-server' ,
                                                                     'use_date'          : True             ,
                                                                     'use_hours'         : True             ,
                                                                     'use_minutes'       : False            ,
                                                                     'use_request_path'  : False            ,
                                                                     'use_when'          : True             },
                                 'save_as_gz'        : True                            ,
                                 'server_name'       : S3_DB_BASE__SERVER_NAME         ,
                                 'session_kwargs__s3': { 'aws_access_key_id'    : None ,
                                                         'aws_secret_access_key': None ,
                                                         'endpoint_url'         : None ,
                                                         'region_name'          : None ,
                                                         'service_name'         : 's3' },
                                 'use_minio'        : False                             }

    def test__check_setup(self):
        with self.s3_db_chat_threads as _:
            assert _.bucket_exists() is True
            assert _.s3_bucket() == f'{S3_DB_BASE__BUCKET_NAME__PREFIX}-{aws_config.account_id()}-chat-threads'
            assert _.json() == { 'bucket_name__insert_account_id': True,
                                 'bucket_name__prefix'           : S3_DB_BASE__BUCKET_NAME__PREFIX,
                                 'bucket_name__suffix'           : S3_BUCKET_SUFFIX__CHAT_THREADS ,
                                 's3_key_generator'              : {'root_folder'       : 'chat-threads',
                                                                    's3_path_block_size': 5,
                                                                    'save_as_gz'        : True,
                                                                    'server_name'       : S3_DB_BASE__BUCKET_NAME__SUFFIX,
                                                                    'use_date'          : True,
                                                                    'use_hours'         : True,
                                                                    'use_minutes'       : False,
                                                                    'use_request_path'  : False,
                                                                    'use_when'          : True},
                                 'save_as_gz'                     : True,
                                 'server_name'                    : S3_DB_BASE__BUCKET_NAME__SUFFIX,
                                 'session_kwargs__s3'             : { 'aws_access_key_id'    : None ,
                                                                      'aws_secret_access_key': None ,
                                                                      'endpoint_url'         : None ,
                                                                      'region_name'          : None ,
                                                                      'service_name'         : 's3' },
                                 'use_minio'                      : True                            }

    def test_s3_key(self):
        with self.s3_db_chat_threads as _:
            s3_key         = _.s3_key()
            when_str       = _.s3_key_generator.path__for_date_time__now_utc()
            chat_thread_id = s3_key[:-5].split('/')[4]
            llm_request_id = s3_key[:-5].split('/')[5]

            assert is_guid(chat_thread_id) is True
            assert is_guid(llm_request_id) is True
            assert s3_key                  == f'chat-threads/{S3_DB_BASE__BUCKET_NAME__SUFFIX}/{when_str}/{chat_thread_id}/{llm_request_id}/unknown.json.gz'


    def test_save_chat_completion__user_request(self):
        with self.s3_db_chat_threads as _:
            user_prompt         = random_text("user_prompt")
            chat_thread_id      = Random_Guid()
            request_id          = Random_Guid()
            llm_chat_completion = LLMs__Chat_Completion(user_prompt=user_prompt, chat_thread_id=chat_thread_id)
            result              = _.save_chat_completion__user_request(llm_chat_completion, request_id)
            status              = result.get('status')
            s3_key              = result.get('data').get('s3_key')
            llm_request_id      = result.get('data').get('llm_request_id')
            file_data           = _.s3_file_data(s3_key)
            when_str            = _.s3_key_generator.path__for_date_time__now_utc()
            assert status     == 'ok'
            assert s3_key     == f'chat-threads/{S3_DB_BASE__BUCKET_NAME__SUFFIX}/{when_str}/{chat_thread_id}/{llm_request_id}/user-request.json.gz'
            assert file_data  == { "chat_thread_id"     : chat_thread_id                       ,
                                   "llm_chat_completion": { 'chat_thread_id'  : chat_thread_id,
                                                            'histories'       : None          ,
                                                            'images'          : []            ,
                                                            'llm_answer'      : None          ,
                                                            'llm_model'       : None          ,
                                                            'llm_platform'    : None          ,
                                                            'llm_provider'    : None          ,
                                                            'max_tokens'      : None          ,
                                                            'seed'            : 42            ,
                                                            'stream'          : True          ,
                                                            'system_prompts'  : None          ,
                                                            'temperature'     : '0'           ,
                                                            'user_data'       : None          ,
                                                            'user_prompt'     : user_prompt   },
                                   "llm_request_id"     : llm_request_id                       ,
                                   "request_id"         : request_id                           ,
                                   "timestamp"          : file_data.get('timestamp')           }
