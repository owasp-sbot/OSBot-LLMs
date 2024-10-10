from os import getenv
from pathlib import Path

import openai
import requests
from openai                                         import AsyncOpenAI, OpenAI
from osbot_utils.decorators.methods.cache_on_self   import cache_on_self
from osbot_utils.testing.Temp_File                  import Temp_File
from osbot_utils.utils.Dev                          import pprint
from osbot_utils.utils.Env                          import load_dotenv
from osbot_utils.utils.Files                        import file_create_from_bytes


#URL_OPEN_AI_BASE   = "https://api.openai.com/v1"
OPEN_AI__API_KEY   = 'OPEN_AI__API_KEY'
DEFAULT_MAX_TOKENS = 4096
#MAX_ANSWER_SIZE = 512
#MAX_ANSWER_SIZE = 1024                              # todo: see impact of changing this from 512 to 1024
MAX_ANSWER_SIZE = 65536                              # this in practice removes any size restrictions # todo: add feature to enable this only for the billing mode


class API_Open_AI:

    def __init__(self):
        self.stream              = True
        self.seed                = 42
        self.temperature         = 0.0
        # self.model              = 'gpt-4-vision-preview'  # in Nov 2023 is there is a limit of 100 images per day
        self.model               =  'gpt-4o' #'gpt-4-1106-preview'  # gpt-3.5-turbo' #'gpt-4' #
        self.print_create_kwargs = False
        #self.logging             = Logging()

    @cache_on_self
    def api_key(self):
        load_dotenv()
        return getenv(OPEN_AI__API_KEY)

    def embeddings(self, input, model='text-embedding-3-small', dimensions=None):
        url       = 'https://api.openai.com/v1/embeddings'
        headers   = { "Content-Type" : "application/json"        ,
                      "Authorization": f"Bearer {self.api_key()}"}
        json_data = { "input"     : input,
                      "model"     : model }
        if dimensions:
            json_data["dimensions"] =  dimensions

        response        = requests.post(url=url, headers=headers, json=json_data)
        json_data       = response.json()
        embeddings_data = json_data.get('data')[0].get('embedding')
        total_tokens    = json_data.get('usage').get('total_tokens')
        result          = dict(embeddings_data = embeddings_data,
                               model           = model          ,
                               total_tokens     = total_tokens  )
        return result

    def open_ai_available(self):
        if self.api_key():
            #if is_url_online(URL_OPEN_AI_BASE):            # todo, find a better way (or url) to do this
                return True
        return False

    def open_ai_not_available(self):
        return self.open_ai_available() is False

    async def create(self, messages, model=None, temperature=None, seed=None, max_tokens=None):
        openai.api_key = self.api_key()
        kwargs = dict(model       = model       or self.model      ,
                      messages    = messages                       ,
                      temperature = temperature or self.temperature,
                      seed        = seed        or self.seed       ,
                      stream      = self.stream                    ,
                      max_tokens  = max_tokens  or DEFAULT_MAX_TOKENS)

        if self.print_create_kwargs:                            # todo : remove
           pprint(kwargs)

        #self.logging.add_open_ai_create_completions(kwargs)

        #client = AsyncOpenAI(api_key=self.api_key())                   # BUG: nasty bug that was causing loop not closed errors
        async with AsyncOpenAI(api_key=self.api_key()) as client:
            response = await client.chat.completions.create(**kwargs)

            async for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
    def messages(self):
        return [{"role": "user", "content": 'Hi'}]


    def setup(self):
        openai.api_key = self.api_key()
        return self

    def ask_one_question_no_history(self,question, model=None, async_mode=False):
        messages    = [{"role": "user", "content": question}]
        return self.ask_using_messages(messages, model=model, async_mode=async_mode)

    async def ask_using_messages(self, messages, model=None, temperature=None, seed=None, max_tokens=None,  async_mode=False):
        generator    = self.create(messages, model=model, temperature=temperature,seed=seed, max_tokens=max_tokens)
        if async_mode:
            return generator
        full_answer = ""

        async for item in generator:
            if item is not None:
                full_answer += item
        return full_answer


    async def ask_using_system_prompts(self, user_prompt, images=None, system_prompts=None, histories=None, model=None, temperature=None, seed=None, max_tokens=None, async_mode=False):
        messages = []
        if system_prompts:
            for system_prompt in system_prompts:
                messages.append({"role": "system", "content": system_prompt})
        if histories:
            for item in histories:
                question = item.question
                answer   = item.answer
                if answer and len(answer) > MAX_ANSWER_SIZE:
                    answer = answer[:MAX_ANSWER_SIZE] + "...(max)..."
                messages.append({"role": "user"     , "content": question})
                messages.append({"role": "assistant", "content": answer})
        if images:
            user_prompt  = [ { "type"      : "text"      ,
                               "text"      : user_prompt }]
            for image_url in images:
                image = { "type"     : "image_url"       ,
                         "image_url": { "url": image_url }}
                user_prompt.append(image)
        messages.append({"role": "user", "content": user_prompt})

        return await self.ask_using_messages(messages, model=model, temperature=temperature, seed=seed, max_tokens=max_tokens,  async_mode=async_mode)

    def ask_question_with_user_data_and_prompt(self,user_question, user_data, system_prompt, user_history):
        messages = [{"role": "system", "content": system_prompt},
                    {"role": "system", "content": user_data    }]
        for item in user_history:
            question = item.get('question')
            answer   = item.get('answer')
            messages.append({"role": "user"     , "content": question})
            messages.append({"role": "assistant", "content": answer})
        messages.append({"role": "user", "content": user_question})

        #pprint(messages)
        return self.ask_using_messages(messages)


    def audio_to_text(self, audio_bytes, model="whisper-1"):
        with Temp_File(extension=".mp3") as temp_file:
            file_create_from_bytes(path=temp_file.file_path, bytes=audio_bytes)
            client        = OpenAI(api_key=self.api_key())  # refactor to helper method
            path          = Path(temp_file.file_path)
            transcription = client.audio.transcriptions.create(model=model,file=path)
            return transcription.text

    def text_to_audio(self, input_text, voice='shimmer', model="tts-1"):
        client = OpenAI(api_key=self.api_key())                                  # refactor to helper method
        response = client.audio.speech.create(model=model     ,                  # tts-1-hd | tts-1
                                              voice=voice     ,                  # alloy, echo, fable, onyx, nova, and shimmer
                                              input=input_text
        )
        audio_bytes = response.content
        return audio_bytes
        #response.stream_to_file(speech_file_path)