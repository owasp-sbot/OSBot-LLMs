from osbot_utils.base_classes.Type_Safe                 import Type_Safe
from osbot_utils.decorators.methods.cache_on_self       import cache_on_self
from osbot_llms.OSBot_LLMs__Server_Config               import osbot_llms__server_config
from osbot_llms.backend.s3_minio.S3_DB__Chat_Threads    import S3_DB__Chat_Threads

class OSBot_LLMs__Shared_Objects(Type_Safe):

    @cache_on_self
    def s3_db_chat_threads(self):                                               # todo: refactor this code with the method s3_db_server_requests() since 95% is the same
        server_name = osbot_llms__server_config.server_name
        use_minio   = osbot_llms__server_config.s3_s3_use_minio                 # setup use of minio (vs aws)
        kwargs      = dict(use_minio   = use_minio   ,
                           server_name =  server_name)
        with  S3_DB__Chat_Threads(**kwargs)  as _:
            _.setup()                                                           # set up tasks, including creating target bucket if it doesn't exist
            _.s3_key_generator.use_request_path = False
            _.s3_key_generator.use_when         = True
            _.s3_key_generator.use_hours        = True
            _.s3_key_generator.use_minutes      = False
            return _

osbot_llms__shared_objects = OSBot_LLMs__Shared_Objects()
