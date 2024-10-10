from fastapi                                        import Request, Response
from osbot_utils.base_classes.Type_Safe             import Type_Safe
from osbot_utils.decorators.methods.cache_on_self   import cache_on_self

from osbot_llms.OSBot_LLMs__Server_Config  import osbot_llms__server_config
from osbot_llms.OSBot_LLMs__Shared_Objects import osbot_llms__shared_objects


class Chats_Storage__S3_Minio(Type_Safe):

    def __init__(self):
        super().__init__()

    @cache_on_self
    def s3_log_requests(self):
        return osbot_llms__server_config.s3_log_requests

    @cache_on_self
    def s3_db_chat_threads(self):
        return osbot_llms__shared_objects.s3_db_chat_threads()

    def save_user_request(self, llm_chat_completion, request_id):
        if osbot_llms__server_config.s3_log_requests:
            result = osbot_llms__shared_objects.s3_db_chat_threads().save_chat_completion__user_request(llm_chat_completion, request_id)
            if result.get('status') == 'ok':
                return result.get('data')
        return {}

    def save_user_response(self, llm_chat_completion, request_id):
        if self.s3_log_requests():
            return self.s3_db_chat_threads().save_chat_completion__user_response(llm_chat_completion,request_id)
        return {}