from unittest import TestCase

import httpx
from fastapi                                import FastAPI, Request
from osbot_utils.helpers.Random_Guid        import Random_Guid
from osbot_utils.utils.Http                 import url_join_safe
from osbot_fast_api.utils.Fast_API_Server   import Fast_API_Server
from starlette.responses                    import StreamingResponse


class test__chained_fast_api(TestCase):

    def test_check__fast_api_2(self):

        # FastAPI_2 (Backend Service):
        app_2 = FastAPI()

        async def generate_stream_data(api_key):
            for i in range(3):
                yield f"Data chunk {i}: {api_key}\n"

        @app_2.post("/chat/completions")
        async def chat_completions(request: Request):
            request_body = await request.json()
            api_key      = request_body.get("api_key", '(no key)')
            return StreamingResponse(generate_stream_data(api_key), media_type="text/plain")


        # FastAPI_1 (Intermediate Service)
        app_1 = FastAPI()

        async def proxy_stream(url: str, json_payload: dict, headers: dict):
            async with httpx.AsyncClient() as client:
                async with client.stream("POST", url, json=json_payload, headers=headers) as response:
                    async for chunk in response.aiter_text():
                        yield chunk


        @app_1.post("/chat/completions")
        async def chat_completions(request: Request):
            request_body = await request.json()
            api_key      = f"YOUR_API_KEY : {Random_Guid()}"
            backend_url  = request_body.get("backend_url")
            request_body["api_key"] = api_key

            response  = StreamingResponse(proxy_stream(backend_url, request_body, headers={"accept": "text/plain"}),media_type="text/plain")
            response.headers['api_key'] = api_key
            return response

        with Fast_API_Server(app=app_2) as fast_api_2:
            response_1 = fast_api_2.requests_post("/chat/completions", data={})
            assert response_1.status_code == 200
            assert response_1.text        == 'Data chunk 0: (no key)\nData chunk 1: (no key)\nData chunk 2: (no key)\n'

            post_data  = dict(user_prompt = '40_2',
                              backend_url = url_join_safe(fast_api_2.url(), '/chat/completions'))
            with Fast_API_Server(app=app_1) as fast_api_1:
                response_2 = fast_api_1.requests_post("/chat/completions", data=post_data)
                assert response_2.status_code == 200
                api_key = response_2.headers.get('api_key')
                assert 'YOUR_API_KEY' in api_key
                assert response_2.text == (f'Data chunk 0: {api_key}\n'
                                           f'Data chunk 1: {api_key}\n'
                                           f'Data chunk 2: {api_key}\n')
