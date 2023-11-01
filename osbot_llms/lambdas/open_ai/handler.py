import sys

sys.path.append('/opt/python')          # this needs to be done since LWA loses the path to the layers
sys.path.append('/var/task'  )          # path to lambda function code

import uvicorn
from   osbot_llms.fastapi.FastAPI_LLMs import FastAPI_LLMs

def run():
    fastapi_llms = FastAPI_LLMs()
    fastapi_llms.run_in_lambda()

if __name__ == '__main__':
     run()                                  # to be triggered from run.sh