from osbot_utils.base_classes.Type_Safe import Type_Safe

DEFAULT__SERVER_CONFIG__SERVER_NAME = 'osbot-llms'

class OSBot_LLMs__Server_Config(Type_Safe):         # todo: add workflow to load this from a json/toml config file
    s3_log_requests : bool  = False
    server_name     : str   = DEFAULT__SERVER_CONFIG__SERVER_NAME
    s3_s3_use_minio : bool  = True

osbot_llms__server_config = OSBot_LLMs__Server_Config()