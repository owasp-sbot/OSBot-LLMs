# todo: add support for direct calls to Google's Gemini

# def test_call_google_gemini(self):
#     api_key = getenv("GOOGLE_GEMINI__API_KEY")
#
#     # GENAI_API_DISCOVERY_URL = "https://generativelanguage.googleapis.com/$discovery/rest"
#     # uri = f"{GENAI_API_DISCOVERY_URL}?version=v1beta&key={api_key}"
#     # response = requests.get(uri)
#     # pprint(response.json())
#     # return
#     # url = "https://generativelanguage.googleapis.com/v2/models/?key=" + API_KEY
#     # models = requests.get(url)
#     # pprint(models.json())
#     # return
#     url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + api_key
#     data = {"contents": [{"parts": [{"text": "What is 2+2"}]}]}
#     with print_duration():
#         response = requests.post(url, json=data)
#
#     pprint(response.text)