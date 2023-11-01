from osbot_utils.utils.Dev import pprint

from osbot_llms.fastapi.FastAPI_LLMs import FastAPI_LLMs

fastapi_llms = FastAPI_LLMs().setup()

app = fastapi_llms.app()

