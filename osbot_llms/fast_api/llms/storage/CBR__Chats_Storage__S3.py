from fastapi                                        import Request, Response
from cbr_shared.cbr_sites.CBR_Site__Shared_Objects  import cbr_site_shared_objects
from cbr_shared.config.Server_Config__CBR_Website   import server_config__cbr_website
from osbot_utils.base_classes.Type_Safe             import Type_Safe
from osbot_utils.decorators.methods.cache_on_self   import cache_on_self


class CBR__Chats_Storage__S3(Type_Safe):

    def __init__(self):
        super().__init__()

    @cache_on_self
    def s3_log_requests(self):
        return server_config__cbr_website.s3_log_requests()

    @cache_on_self
    def s3_db_chat_threads(self):
        return cbr_site_shared_objects.s3_db_chat_threads()

    def save_user_request(self, llm_chat_completion, request_id):
        if server_config__cbr_website.s3_log_requests():
            result = cbr_site_shared_objects.s3_db_chat_threads().save_chat_completion__user_request(llm_chat_completion, request_id)
            if result.get('status') == 'ok':
                return result.get('data')
        return {}

    def save_user_response(self, llm_chat_completion, request_id):
        if self.s3_log_requests():
            self.s3_db_chat_threads().save_chat_completion__user_response(llm_chat_completion,request_id)




# todo: delete this when confirming that it has been replaced with the code in the new version of CBR__Chats_Storage__S3
    # # todo: use this version instead of the one in CBR__Chats_Storage__Local
    # def s3_chat_save(self, chat_id, chat_data):
    #     if cbr_config_athena.aws_disabled():                # todo: add special flag to capture the chat save
    #         return False
    #     try:
    #         print("---------- Saving CHAT to S3 ---------")
    #         s3_key     = self.s3_key_for_cache_id(chat_id)
    #         data       = chat_data
    #         self.s3_db_base.s3_save_data(data, s3_key)
    #
    #         print('s3_bucket', self.s3_db_base.s3_bucket())
    #         print('s3_key'   , s3_key   )
    #         return s3_key
    #
    #     except Exception as error:
    #         pprint(f'error in saving chat to s3: {error}')
    #
    # # todo: add support for calculating the self.chat value (which is pointing to the current date
    # def s3_key_for_cache_id(self, chat_id):
    #     pprint(f"Saved chat with id: {chat_id}")
    #     s3_key = self.chat(chat_id).path_cache_file().replace(current_temp_folder(), '')        # todo: BUG self.chat doesn't exist
    #     return s3_key[1:]
    #
    # def folders__days(self):
    #     return self.s3_db_base.s3_folder_list(CACHE_NAME__CHATS_CACHE)
    #
    # def folder__chat_ids(self, day):
    #     s3_path = path_combine_safe(CACHE_NAME__CHATS_CACHE, day)
    #     if s3_path:
    #         return self.s3_db_base.s3_folder_files(s3_path)