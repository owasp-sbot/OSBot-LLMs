from osbot_utils.utils.Status                           import status_warning
from osbot_llms.backend.s3_minio.S3_DB_Base__Disabled   import S3_DB_Base__Disabled
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads    import S3_DB__Chat_Threads
from osbot_llms.models.LLMs__Chat_Completion            import LLMs__Chat_Completion

class S3_DB__Chat_Threads__Disabled(S3_DB__Chat_Threads, S3_DB_Base__Disabled):

    def s3_key(self, **kwargs):
        return None

    def save_chat_completion__user_request(self, llm_chat_completion: LLMs__Chat_Completion, request_id: str):
        return status_warning("Warning: using S3_DB__Chat_Threads__Disabled, so no data will be saved.")

    def save_chat_completion__user_response(self, llm_chat_completion: LLMs__Chat_Completion, request_id: str):
        return status_warning("Warning: using S3_DB__Chat_Threads__Disabled, so no data will be saved.")