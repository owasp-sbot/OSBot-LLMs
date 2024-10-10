from collections                                        import Counter
from statistics                                         import mean
from cbr_athena.llms.storage.CBR__Chats_Storage__Local  import CBR__Chats_Storage__Local
from osbot_utils.base_classes.Type_Safe                 import Type_Safe
from osbot_utils.utils.Dev import pprint

# todo: refactor this to the new S3 mode
class CBR__Chats__Analysis(Type_Safe):
    cbr_chats_storage :CBR__Chats_Storage__Local

    def chats_latest(self):
        return self.cbr_chats_storage.chats_latest()

    def chats_latest__simple_view(self):
        chats_simple_view = []
        for chat in self.chats_latest():
            #pprint(chat)
            size_histories  = len(chat.get('histories') or [])
            size_llm_answer = len(chat['llm_answer'])
            size_llm_prompt = len(chat['user_prompt'])


            chat_simple_view = dict(size_histories  = size_histories  ,
                                    size_llm_answer = size_llm_answer ,
                                    size_llm_prompt = size_llm_prompt )

            chats_simple_view.append(chat_simple_view)
        return chats_simple_view

    def chats_stats(self):
        chats               = self.chats_latest()
        total_chats         = 0
        models_counter      = Counter()
        platforms_counter   = Counter()
        providers_counter   = Counter()
        llm_answer_lengths  = []
        questions_counter   = Counter()
        answers_counter     = Counter()


        for chat in chats:
            if chat:
                total_chats += 1
                if chat.get('user_data'):
                    models_counter   [chat.get('user_data'  , {}).get('selected_model'    )] += 1
                    platforms_counter[chat.get('user_data'  , {}).get('selected_platform' )] += 1
                    providers_counter[chat.get('user_data'  , {}).get('selected_provider' )] += 1
                    questions_counter[chat.get('user_prompt', '')                          ] += 1
                    answers_counter  [chat.get('llm_answer' , '')                          ] += 1
                    llm_answer_lengths.append(len(chat['llm_answer']))

        average_llm_answer_length = mean(llm_answer_lengths) if llm_answer_lengths else 0

        stats = { 'average_llm_answer_length' : average_llm_answer_length  ,
                  'total_chats'               : total_chats                ,
                  'models_frequency'          : dict(models_counter       ),
                  'platforms_frequency'       : dict(platforms_counter    ),
                  'providers_frequency'       : dict(providers_counter    )}

        return stats
