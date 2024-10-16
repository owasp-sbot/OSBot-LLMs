from osbot_utils.utils.Dev                  import pprint
from osbot_utils.utils.Env                  import get_env, load_dotenv
from osbot_aws.AWS_Config                   import aws_config
from osbot_utils.base_classes.Type_Safe     import Type_Safe
from osbot_aws.deploy.Deploy_Lambda         import Deploy_Lambda

from osbot_llms.utils.Version import version__osbot_llms


class Deploy_Lambda__OSBot_LLMs(Type_Safe):
    lambda_name : str = 'osbot_llms'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.setup_aws_credentials()
        self.deploy_lambda   = Deploy_Lambda(self.lambda_name)
        self.lambda_function = self.deploy_lambda.lambda_function()

    def deploy(self):
        self.lambda_setup()
        self.deploy_lambda.deploy()
        self.lambda_setup_post_update()

    def invoke(self):
        with self.lambda_function as _:
            result = _.invoke()
            return result

    def lambda_setup(self):
        self.deploy_lambda.set_container_image(self.ecr_image_uri())
        env_variables = {'IP_DATA__API_KEY'       : get_env('IP_DATA__API_KEY'   , ''),
                         'OPEN_AI__API_KEY'       : get_env('OPEN_AI__API_KEY'   , ''),
                         'OPEN_ROUTER_API_KEY'    : get_env('OPEN_ROUTER_API_KEY', ''),
                         'GROQ_API_KEY'           : get_env('GROQ_API_KEY'       , ''),
                         'TOGETHER_AI_API_KEY'    : get_env('TOGETHER_AI_API_KEY', ''),
                         'MISTRAL_API_KEY'        : get_env('MISTRAL_API_KEY'    , ''),
                         'SAMBANOVA_API_KEY'      : get_env('SAMBANOVA_API_KEY'  , '')}
        self.deploy_lambda.set_env_variables(env_variables)

    def lambda_setup_post_update(self):
        with self.lambda_function as _:
            if _.function_url_exists() is False:
                _.function_url_create_with_public_access()



    def ecr_image_uri(self):
        account_id  = aws_config.account_id()
        region_name = aws_config.region_name()
        image_name  = self.lambda_name
        image_tag   = version__osbot_llms
        return f'{account_id}.dkr.ecr.{region_name}.amazonaws.com/{image_name}:{image_tag}'

    def setup_aws_credentials(self):
        load_dotenv()
        aws_config.set_aws_session_account_id (get_env('AWS_ACCOUNT_ID__654654216424'       ))
        aws_config.set_region                 (get_env('AWS_DEFAULT_REGION__654654216424'   ))
        aws_config.set_aws_access_key_id      (get_env('AWS_ACCESS_KEY_ID__654654216424'    ))
        aws_config.set_aws_secret_access_key  (get_env('AWS_SECRET_ACCESS_KEY__654654216424'))


if __name__ == '__main__':
    print("****************************************************")
    print("****   Deploy_Lambda__OSBot_LLMs                ****")
    print("****************************************************")
    print()
    with Deploy_Lambda__OSBot_LLMs() as _:
        print(f"... deploying lambda function: {_.lambda_name}")
        _.deploy()
        response = _.invoke()
        print(f"... invocation response: {response}")
        function_url = _.lambda_function.function_url()
        print(f"...you can try it at {function_url}")