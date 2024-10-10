from osbot_utils.helpers.Local_Caches import Local_Caches


class Open_AI_Cache:

    def __init__(self):
        self.local_caches   = Local_Caches()
        self.cache_chat_gpt = self.local_caches.cache('chat_gpt')
