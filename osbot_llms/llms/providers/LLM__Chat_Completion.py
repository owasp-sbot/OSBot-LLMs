from osbot_utils.base_classes.Type_Safe             import Type_Safe
from osbot_llms.llms.providers.LLM__Execute_Request import LLM__Execute_Request

#MAX_ANSWER_SIZE = 512
MAX_ANSWER_SIZE = 65536                         # this in practice removes any size restrictions # todo: add feature to enable this only for the billing mode

class LLM__Chat_Completion(Type_Safe):
    base_url : str
    api_key  : str
    model    : str
    messages : list
    stream   : bool = True

    def add_histories(self, histories):
        if type(histories) is list:
            for item in histories:
                question = item.question
                answer   = item.answer
                if answer and len(answer) > MAX_ANSWER_SIZE:                        # todo: move this to a separate method and make this more scientific (for example using an LLM to create a summary)
                    answer = answer[:MAX_ANSWER_SIZE] + "..."               # do this so that we don't have an exponential growth in the size of the content sent to the LLMs
                self.add_message('user'     , question)
                self.add_message('assistant', answer)

    def add_message__system(self, system_prompt):
        self.add_message('system', system_prompt)
        return self

    def add_message__user(self, user_prompt, images=None):
        if images:
            user_prompt  = [ { "type"      : "text"      ,
                               "text"      : user_prompt }]
            for image_url in images:
                image = { "type"     : "image_url"       ,
                         "image_url": { "url": image_url }}
                user_prompt.append(image)

        self.add_message('user', user_prompt)
        return self

    def add_messages__system(self, system_prompts):
        if type(system_prompts) is list:
            for system_prompt in system_prompts:
                self.add_message__system(system_prompt)
        return self

    def add_messages__user(self, user_prompts):
        for user_prompt in user_prompts:
            self.add_message__user(user_prompt)
        return self

    def add_message(self, role, content):
        message = {'role': role, 'content': content}
        self.messages.append(message)
        return self

    def chat_completion(self):
        if self.stream:
            return self.chat_completion__streamed()
        else:
            return self.chat_completion__not_streamed()

    def chat_completion__not_streamed(self):
        if self.is_provider_not_available():
            return f"Provider not available"
        messages = self.messages
        headers  =  { 'Authorization': f'Bearer {self.api_key}',
                      'Content-Type' : 'application/json'      }
        json_data = { 'messages': messages   ,
                      'model'   : self.model ,
                      'stream'  : False      }
        post_data = { 'headers': headers     ,
                      'json'   : json_data    ,
                      'url'    : self.base_url}
        response = LLM__Execute_Request(post_data=post_data).execute()
        return response

    def chat_completion__streamed(self):
        if self.is_provider_not_available():
            yield f"Provider not available"
            return
        messages = self.messages
        headers  =  { 'Authorization': f'Bearer {self.api_key}',
                      'Content-Type' : 'application/json'      }
        json_data = { 'messages': messages   ,
                      'model'   : self.model ,
                      'stream'  : True       }
        post_data = { 'headers': headers     ,
                      'json'   : json_data    ,
                      'url'    : self.base_url}
        response  = LLM__Execute_Request(post_data=post_data).requests_post__streamed(**post_data)
        #response  = self.requests_post__streamed(**post_data)
        for item in response:
            yield item

    def is_provider_available(self):
        if self.api_key:
            return True
        return False

    def is_provider_not_available(self):
        return self.is_provider_available() is False

    def json_data(self):
        payload = { "messages": self.messages,
                    "model"   : self.model  }
        return payload

    # todo: see if this is needed (since this was created for the LLM__Action__Chat_Completion which also needs a rewrite)
    def post_data(self):
        url     = self.base_url
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers['Authorization'] = f"Bearer {self.api_key}"
        json    = self.json_data()
        return dict(url=url, headers=headers, json=json)

    # todo: see if this is needed (since this was created for the LLM__Action__Chat_Completion which also needs a rewrite)
    def send_post_data(self):
        post_data = self.post_data()
        result    = LLM__Execute_Request(post_data=post_data).make_request(post_data=post_data)
        return result

    def send_user_prompt(self, user_prompt):                # todo: see if we need this
        self.add_message__user(user_prompt)
        post_data = self.post_data()
        #pprint(post_data)
        result    =  LLM__Execute_Request(post_data=post_data).make_request(post_data=post_data)
        return result

    def set_model(self, value):
        self.model = value
        return self

    def set_stream(self, value):
        self.stream = value
        return self