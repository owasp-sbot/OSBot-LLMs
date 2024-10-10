from cbr_shared.aws.s3.S3_DB_Base                           import S3_DB_Base
from cbr_athena.config.CBR__Config__Athena                  import cbr_config_athena
from cbr_shared.cbr_sites.CBR_Site__Shared_Objects          import cbr_site_shared_objects
from cbr_shared.config.Server_Config__CBR_Website import server_config__cbr_website
from cbr_shared.schemas.base_models.chat_threads.LLMs__Chat_Completion import LLMs__Chat_Completion
from osbot_utils.base_classes.Type_Safe                     import Type_Safe
from osbot_utils.helpers.Local_Caches                       import Local_Caches
from osbot_utils.utils.Dev                                  import pprint
from osbot_utils.utils.Files                                import path_combine, folder_create, current_temp_folder
from osbot_utils.utils.Json                                 import from_json_str
from osbot_utils.utils.Misc                                 import is_guid, random_guid, date_time_now, date_today

CACHE_NAME__CHATS_CACHE =  'chats_cache'
#CACHE_NAME__CHATS_CACHE =  'chats_cache/2024-07-16'

class CBR__Chats_Storage__Local(Type_Safe):
    chats_cache : Local_Caches

    def __init__(self):
        super().__init__()
        self.chats_cache.caches_name =  self.path_caches_name()

    def chat(self, chat_id):
        return self.chats_cache.cache(chat_id)

    def chat_data(self, chat_id):
        return self.chat(chat_id).data()

    def chat_delete(self, chat_id):
        return self.chats_cache.cache(chat_id).cache_delete()

    def chat_exists(self, chat_id):
        return self.chats_cache.cache(chat_id).cache_exists()

    def chats_ids(self):
        return self.chats_cache.existing_cache_names()

    def chats_latest(self):
        chats_latest = []
        for chat_id in self.chats_ids():
            latest = self.chat(chat_id).get('latest')
            if latest:
                chats_latest.append(latest)
        return chats_latest

    def chat_latest(self, chat_id):
        return self.chat(chat_id).get('latest')

    def chat_save(self, llm_chat_completion: LLMs__Chat_Completion, request_id: str):
        # if server_config__cbr_website.s3_log_requests():                                                             # todo: refactor this out from this 'Storage__Local' class
        #     s3_key = cbr_site_shared_objects.s3_db_chat_threads().save_chat_completion__user_response(llm_chat_completion,request_id)  # save chat in dedicated S3 bucket

        chat_id = llm_chat_completion.chat_thread_id

        if chat_id is None or is_guid(chat_id) is False:
            chat_id = llm_chat_completion.chat_thread_id = random_guid()
        chat_cache = self.chats_cache.cache(chat_id)
        cache_key  = date_time_now()
        cache_data = from_json_str(llm_chat_completion.json())
        chat_cache.add(cache_key, cache_data)
        chat_cache.add('latest', cache_data)

        self.s3_chat_save(chat_id, cache_data)
        return cache_key

    def setup(self):
        self.chats_cache.setup()                                    # make sure the caches folder existgs
        return self

    def path_caches_name(self):
        caches_name = f'{CACHE_NAME__CHATS_CACHE}/{date_today()}'
        return caches_name

    def path_chats_cache(self):
        return self.chats_cache.path_local_caches()

    # todo refactor this into another class

    def s3_chat_save(self, chat_id, chat_data):
        if cbr_config_athena.aws_disabled():                # todo: add special flag to capture the chat save
            return False
        try:
            print("---------- Saving CHAT to S3! ---------")
            s3_key     = self.s3_key_for_cache_id(chat_id)
            s3_db_base = S3_DB_Base()
            data       = chat_data
            s3_db_base.s3_save_data(data, s3_key)

            print('s3_bucket', s3_db_base.s3_bucket())
            print('s3_key'   , s3_key   )
            return s3_key

        except Exception as error:
            pprint(f'error in saving chat to s3: {error}')

    def s3_key_for_cache_id(self, chat_id):
        pprint(f"Saved chat with id: {chat_id}")
        s3_key = self.chat(chat_id).path_cache_file().replace(current_temp_folder(), '')
        return s3_key[1:]