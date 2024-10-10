from osbot_aws.AWS_Config                                   import aws_config
from osbot_llms.backend.s3_minio.S3_DB_Base                 import S3_DB_BASE__BUCKET_NAME__PREFIX, S3_DB_BASE__BUCKET_NAME__SUFFIX
from osbot_llms.testing.TestCase__S3_Minio__Temp_S3_Bucket  import TestCase__S3_Minio__Temp_S3_Bucket


class test_S3_DB__Base(TestCase__S3_Minio__Temp_S3_Bucket):

    def test_s3_bucket(self):
        with self.s3_db_base as _:
            aws_account_id = aws_config.account_id()
            assert _.s3_bucket    () == f"{S3_DB_BASE__BUCKET_NAME__PREFIX}-{aws_account_id}-{S3_DB_BASE__BUCKET_NAME__SUFFIX}"
            assert _.using_minio  () is True
            assert _.bucket_exists() is True
