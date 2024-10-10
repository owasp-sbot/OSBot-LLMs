import requests
from osbot_utils.utils.Env                          import get_env
from osbot_utils.utils.Json                         import from_json_str
from osbot_llms.llms.chats.LLM__Platform_Engine     import LLM__Platform_Engine
from osbot_llms.llms.providers.ollama.LLM__Ollama   import LLM__Ollama
from osbot_llms.models.LLMs__Chat_Completion        import LLMs__Chat_Completion

OLLAMA__BASE_URL          = "http://localhost:11434"
ENV_VAR__OLLAMA__BASE_URL = 'OLLAMA__BASE_URL'

class LLM__Platform_Engine__Ollama(LLM__Platform_Engine):
    llm_platform       : str
    llm_provider       : str
    llm_model          : str
    llm_chat_completion: LLMs__Chat_Completion

    def is_provider_available(self):
        try:
            response = requests.get(self.ollama_base_url())
            if response.text == "Ollama is running":
                return True
        except requests.RequestException:
            pass
        return False

    def llm_ollama(self):
        return LLM__Ollama(base_url=self.ollama_base_url())

    def ollama_base_url(self):
        return get_env(ENV_VAR__OLLAMA__BASE_URL)  or OLLAMA__BASE_URL

    # todo: add support for non streamed requests
    def execute_request(self):
        if self.is_provider_available():
            try:
                request_kwargs = dict(prompt = self.llm_chat_completion.user_prompt,
                                      model  = self.llm_model                      ,
                                      stream = True                                )
                result = self.llm_ollama().api_generate(**request_kwargs)
                for json_line in result:
                    if json_line:
                        chunk = from_json_str(json_line)
                        yield chunk.get('response')
            except Exception as error:
                yield f"Error when execution Ollama request: {error}"
        else:
            yield "Ollama is not available"