from osbot_llms.OSBot_LLMs__Server_Config import osbot_llms__server_config
from osbot_llms.fast_api.Fast_API__LLMs import Fast_API__LLMs

osbot_llms__server_config.s3_log_requests = True
llm_fast_api = Fast_API__LLMs().setup()
app          = llm_fast_api.app()

