from osbot_utils.utils.Misc                            import timestamp_utc_now
from osbot_utils.utils.Status                          import status_ok, status_error
from osbot_llms.backend.s3_minio.S3_DB_Base            import S3_DB_Base
from osbot_llms.backend.s3_minio.S3__Key__Chat_Thread  import S3__Key__Chat_Thread
from osbot_llms.models.LLMs__Chat_Completion           import LLMs__Chat_Completion

S3_BUCKET_SUFFIX__CHAT_THREADS    = 'chat-threads'
CHAT__REQUEST_TYPE__USER_REQUEST  = 'user-request'
CHAT__REQUEST_TYPE__USER_RESPONSE = 'user-response'
CHAT__REQUEST_TYPE__LLM_REQUEST   = 'llm-request'
CHAT__REQUEST_TYPE__LLM_RESPONSE  = 'llm-response'

class S3_DB__Chat_Threads(S3_DB_Base):
    bucket_name__suffix   : str = S3_BUCKET_SUFFIX__CHAT_THREADS
    save_as_gz            : bool = True
    s3_key_generator      : S3__Key__Chat_Thread


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        with self.s3_key_generator as _:
            _.root_folder      = S3_BUCKET_SUFFIX__CHAT_THREADS
            _.save_as_gz       = self.save_as_gz
            _.server_name      = self.server_name
            _.use_hours        = True
            _.use_minutes      = False
            _.use_request_path = False

    def s3_key(self, **kwargs):
        s3_key = self.s3_key_generator.create__for__chat_thread(**kwargs)
        return s3_key

    # move these files to the S3_Chat_Thread class

    def save_chat_completion__user_request(self, llm_chat_completion: LLMs__Chat_Completion, request_id: str):
        if not request_id:
            return
        request_type           = CHAT__REQUEST_TYPE__USER_REQUEST
        llm_request_id         = request_id
        chat_thread_id         = llm_chat_completion.chat_thread_id
        chat_data              = dict(request_id          = request_id                       ,
                                      chat_thread_id      = chat_thread_id                   ,
                                      llm_request_id      = llm_request_id                   ,
                                      timestamp           =  timestamp_utc_now()             ,
                                      llm_chat_completion =  llm_chat_completion.json())
        s3_key                 = self.s3_key(chat_thread_id=chat_thread_id, llm_request_id=llm_request_id, request_type=request_type)
        s3_key_items           = s3_key.split('/')
        public_chat_id         = '/'.join(s3_key_items[2:6])
        public_chat_thread__id = '/'.join(s3_key_items[2:5])

        metadata               = { 'request_id'  : request_id   ,
                                   'request_type': request_type }
        if self.s3_save_data(data=chat_data, s3_key=s3_key, metadata=metadata):
            return status_ok(data={'llm_request_id'        : llm_request_id         ,
                                   'public_chat_id'        : public_chat_id         ,
                                   'public_chat_thread__id': public_chat_thread__id ,
                                   's3_key'                :s3_key                  })
        return status_error(message="s3 save data failed")

    def save_chat_completion__user_response(self, llm_chat_completion: LLMs__Chat_Completion, request_id: str):
        request_type   = CHAT__REQUEST_TYPE__USER_RESPONSE
        chat_thread_id = llm_chat_completion.chat_thread_id
        llm_request_id = request_id
        s3_key         = self.s3_key(chat_thread_id=chat_thread_id, llm_request_id=llm_request_id, request_type=request_type)
        data           = llm_chat_completion.json()
        metadata = {'request_id'    : request_id    ,
                    'request_type'  : request_type  }
        if self.s3_save_data(data=data, s3_key=s3_key, metadata=metadata):
            return status_ok(data={'llm_request_id': llm_request_id, 's3_key':s3_key})
        return status_error(message="s3 save data failed")


