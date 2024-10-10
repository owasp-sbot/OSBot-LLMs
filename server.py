from osbot_llms.fast_api.LLMs__Fast_API import LLMs__Fast_API

llm_fast_api = LLMs__Fast_API().setup()
app = llm_fast_api.app()

