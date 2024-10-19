
from unittest import TestCase
import pytest
import requests
#from bs4 import BeautifulSoup
from osbot_utils.helpers.Random_Guid import Random_Guid
from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Files import file_create, file_contains, file_contents, temp_file
from osbot_utils.utils.Json import json_load, json_parse, json_file_create, json_file_load
from osbot_utils.utils.Objects import dict_to_obj
from osbot_llms.models.GPT_History import GPT_History
from osbot_llms.models.LLMs__Chat_Completion import LLMs__Chat_Completion


# notes:
#       - this worked really well :)
#       - the use of bs4 might be a bit overthe top since all we need is the contents of the last script tag
#       - there was a bug with Html_To_Tag that prevented its use ( todo: see why and fix it)
# @pytest.mark.skip("Needs to be integrated into a service")
# class test_chat_gpt_threads(TestCase):
#     def test_load_chat_gpt_saved_chat(self):
#
#         # url      = "https://chatgpt.com/share/6713bfef-3778-8006-9bbd-01f842395d6c"
#         # response = requests.get(url)
#         # assert response.status_code
#         # html_code = response.text
#         #html_file         = file_create(contents=html_code, extension=".html")
#
#         # html_file         = '/var/folders/z4/3k99j_cn39g_0jnqt6w57f6m0000gn/T/tmpqnpeu3bj.html'
#         # html_code         = file_contents(path=html_file)
#         # html_soup         = BeautifulSoup(html_code, 'html.parser')
#         # js_code           = html_soup.find_all('script')[1].text
#         # json_code         = js_code[24:-1]
#         # json_data         = json.loads(json_code)
#
#         #json_file         = json_file_create(json_data, path=temp_file(extension=".json"))
#         json_file          = '/var/folders/z4/3k99j_cn39g_0jnqt6w57f6m0000gn/T/tmpw28a0cpx.json'
#         json_data          = json_file_load(json_file)
#         json_obj          = dict_to_obj(json_data)
#
#         action_json = json_data.get('state').get('loaderData').get('routes/share.$shareId.($action)')
#         action_obj = dict_to_obj(action_json)
#
#         data_obj   = action_obj.serverResponse.data
#
#         title = data_obj.title
#         print()
#
#         question = None
#         answer = None
#         for item in data_obj.linear_conversation:
#             if hasattr(item, 'message'):
#                 if hasattr(item.message.metadata, 'is_visually_hidden_from_conversation'):
#                     continue
#                 role =  item.message.author.role
#                 if item.message.content.content_type == 'text':
#                     parts = item.message.content.parts
#                     text = ''.join(parts)
#                     if role == 'user':
#                         question = text
#                     if role == 'assistant':
#                         answer = text
#         gpt_history = GPT_History(question=question, answer=answer)
#         llms_chat_completion = LLMs__Chat_Completion(histories=[gpt_history])
#         llms_chat_completion.chat_thread_id = Random_Guid()
#         llms_chat_completion.user_prompt  = "can you summarize this conversation?"
#         llms_chat_completion.stream       = True
#         llms_chat_completion.llm_platform = "Groq (Free)"
#         llms_chat_completion.llm_provider = "1. Meta"
#         llms_chat_completion.llm_model    = "llama-3.1-70b-versatile"
#
#         request_json = llms_chat_completion.json()
#         #request_url  = "https://community.prod.aws.cyber-boardroom.com/api/llms/chat/completion_proxy"
#         request_url   = "https://community.dev.aws.cyber-boardroom.com/api/open_ai/prompt_with_system__stream"
#         response     = requests.post(request_url, json=request_json)
#
#         pprint(llms_chat_completion.chat_thread_id)
#
#         pprint(dict(response.headers))