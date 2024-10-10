import pytest
import requests
from unittest                                   import TestCase
from dotenv                                     import load_dotenv
from osbot_utils.utils.Dev import pprint

from osbot_llms.apis.open_ai.API_Open_AI        import API_Open_AI
from osbot_llms.lambdas.open_ai.handler         import run
from osbot_utils.utils.Http                     import  current_host_offline
from osbot_aws.helpers.Lambda_Layers_OSBot      import Lambda_Layers_OSBot
from osbot_aws.deploy.Deploy_Lambda             import Deploy_Lambda


class test_lambda_open_ai(TestCase):

    # @classmethod
    # def tearDownClass(cls) -> None:
    #     assert Deploy_Lambda(run).delete() is True

    def setUp(self) -> None:
        if current_host_offline():
            pytest.skip("we are currently offline")
        load_dotenv()
        self.handler_run    = run
        self.deploy_lambda  = Deploy_Lambda(run)
        self.aws_region     = self.deploy_lambda.osbot_setup.region_name
        self.aws_lambda     = self.deploy_lambda.lambda_function()

    def test_create__lambda_function(self):
        if self.deploy_lambda.exists():         # for now, don't recreate the lambda function since it takes a little while and it is not adding a lot of value
          return
        #self.deploy_lambda.delete()
        api_key              = API_Open_AI().api_key()
        handler              = 'osbot_llms/lambdas/open_ai/run.sh'
        arn_layer__lwa       = f"arn:aws:lambda:{self.aws_region}:753240598075:layer:LambdaAdapterLayerX86:17"
        arn_layer__osbot_aws = Lambda_Layers_OSBot().osbot_aws()
        arn_layer__fastapi   = Lambda_Layers_OSBot().fastapi()
        arn_layer__llms      = Lambda_Layers_OSBot().llms()

        self.deploy_lambda.set_env_variable('AWS_LAMBDA_EXEC_WRAPPER', '/opt/bootstrap')        # todo add helper for adding lwa setup
        self.deploy_lambda.set_env_variable('AWS_LWA_INVOKE_MODE'    , 'response_stream')
        self.deploy_lambda.set_env_variable('OPEN_AI__API_KEY'       , api_key          )

        self.deploy_lambda.set_handler     (handler)
        self.deploy_lambda.add_layers      ([arn_layer__lwa         ,
                                             arn_layer__osbot_aws   ,
                                             arn_layer__fastapi     ,
                                             arn_layer__llms        ])

        assert self.deploy_lambda.update() == 'Successful'

        self.deploy_lambda.lambda_function().function_url_create_with_public_access(invoke_mode='RESPONSE_STREAM')

        self.test_function_url()

    def test_update__lambda_function(self):
        assert self.deploy_lambda.update() == 'Successful'
        self.test_function_url()

    def test_function_url(self):
        function_url = self.deploy_lambda.lambda_function().function_url()
        pprint(f'function_url: {function_url}')
        response = requests.get(function_url, allow_redirects=False)
        assert response.headers.get('Location') == '/docs'
        assert response.status_code == 307

    def test_invoke_lambda_function(self):
        #response = self.aws_lambda.invoke()
        response = self.aws_lambda.invoke_return_logs()
        execution_logs = response.get('execution_logs')
        #pprint(self.aws_lambda.info())
        #print()
        print(execution_logs)
        assert 'Temporary Redirect\n' in execution_logs


