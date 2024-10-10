from osbot_utils.utils.Misc                         import random_guid
from osbot_llms.backend.s3_minio.S3__Key_Generator  import S3__Key_Generator

VALUE__REQUEST_TYPE__UNKNOWN = 'unknown'

class S3__Key__Chat_Thread(S3__Key_Generator):
    use_request_path  : bool = False

    def create__for__chat_thread(self, chat_thread_id=None, llm_request_id=None, request_type=None):
        path_elements = self.create_path_elements__from_when()

        if not chat_thread_id:
            chat_thread_id = random_guid()
        if not llm_request_id:
            llm_request_id = random_guid()
        if not request_type:
            request_type = VALUE__REQUEST_TYPE__UNKNOWN
        path_elements.append(chat_thread_id)
        path_elements.append(llm_request_id)

        file_id = request_type

        s3_key = self.create_s3_key(path_elements=path_elements, file_id=file_id)
        return s3_key

