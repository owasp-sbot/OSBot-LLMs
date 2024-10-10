from osbot_utils.utils.Lists                                    import list_in_list
from osbot_llms.backend.s3_minio.S3__Chat_Threads               import S3__Chat_Threads
from osbot_llms.testing.TestCase__S3_Minio__Temp_Chat_Threads   import TestCase__S3_Minio__Temp_Chat_Threads


class test_S3__Chat_Threads(TestCase__S3_Minio__Temp_Chat_Threads):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.s3_chat_threads = S3__Chat_Threads()

    def setUp(self):
        self.s3_keys_count = 3
        self.s3_keys       = super().s3_key__new_chats(count=self.s3_keys_count)

    def test__setUpClass(self):
        assert self.s3_db_chat_threads.using_minio() is True
        assert len(self.s3_keys) == self.s3_keys_count

    def test_all_chat_threads_for_today(self):
        with self.s3_chat_threads as _:
            assert list_in_list(self.s3_keys, _.all_chat_threads_for_today())