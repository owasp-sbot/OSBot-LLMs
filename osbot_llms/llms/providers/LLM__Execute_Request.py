import requests

from osbot_utils.base_classes.Type_Safe import Type_Safe
from osbot_utils.utils.Json import from_json_str
from osbot_utils.utils.Status import status_error


class LLM__Execute_Request(Type_Safe):
    post_data : dict


    def execute(self):
        return self.requests_post__not_streamed(**self.post_data)

    def make_request(self, post_data):
        response  = requests.post(**post_data)
        if response.status_code == 200:
            if response.headers['Content-Type'] == 'application/x-ndjson':
                return response
            else:
                return response.json()
        else:
            return status_error(error=response.text, message=f'request failed with status code: {response.status_code}')

    def requests_post__not_streamed(self, url, json, headers=None):  # todo refactor the other methods to use this naming convention
        try:
            response = requests.post(url, headers=headers, json=json)
            if response.status_code != 200:
                return  f"Error fetching provider data, status_code was {response.status_code}, text was : {response.text}"
            json_data = response.json()
            choice  = json_data.get('choices')[0]
            content = choice.get('message').get('content')
            return content
        except Exception as error:
            return f"Error fetching provider data : {error}"

    def requests_post__streamed(self, url, json, headers=None):  # todo refactor the other methods to use this naming convention
        try:
            response = requests.post(url, headers=headers, json=json, stream=True)
            for line in response.iter_lines():
                if line:
                    raw_data = line.decode('utf-8')
                    if raw_data.startswith('data: {'):
                        json_line = raw_data[5:]
                        json_data = from_json_str(json_line)
                        choice = json_data.get('choices')[0]
                        yield choice.get('delta').get('content')
                    elif raw_data.startswith('{'):
                        yield raw_data
                        # json_data = from_json_str(raw_data)
                        # if json_data:
                        #     yield json_data
        except Exception as error:
            yield f"Error fetching Open Router data : {error}"