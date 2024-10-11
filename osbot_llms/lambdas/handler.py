from mangum                                 import Mangum
from osbot_llms.fast_api.Fast_API__LLMs     import Fast_API__LLMs

fast_api_llms = Fast_API__LLMs().setup()
app           = fast_api_llms.app()
run           = Mangum(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)