import pytest
from unittest                                               import TestCase
from osbot_utils.helpers.sqlite.domains.Sqlite__DB__Files   import Sqlite__DB__Files
from osbot_utils.testing.Logging                            import Logging
from osbot_utils.utils.Dev import pprint
from osbot_utils.utils.Files                                import file_exists, file_not_exists
from osbot_utils.utils.Http                                 import GET, GET_to_file, GET_bytes, GET_bytes_to_file
from osbot_llms.llms.rag.RAG__DB__Sqlite import RAG__DB__Sqlite

class test_RAG__DB__Sqlite(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.path_local_db_rag          = '/tmp/db_rag.sqlite'
        cls.path_local_db_rag__queries = '/tmp/db_rag__queries.sqlite'
        cls.rag_db                     = RAG__DB__Sqlite(db_path=cls.path_local_db_rag         ).setup()
        cls.rag_db__queries            = RAG__DB__Sqlite(db_path=cls.path_local_db_rag__queries).setup()
        cls.logging                    = Logging(log_to_console=False)

    @classmethod
    def tearDownClass(cls):
        cls.rag_db.table_embeddings().commit()

    def content_db(self):                                           # todo: move this to a helper class
        path_local_db = '/tmp/db_static_files.sqlite'
        if file_not_exists(path_local_db):
            url  = 'https://community.dev.aws.cyber-boardroom.com/markdown/static_content/content-db'       # use this a good db  with markdown content
            GET_bytes_to_file(url, path=path_local_db)
        return Sqlite__DB__Files(db_path=path_local_db)

    def test_setup(self):
        with self.rag_db as _:
            assert _.exists()  is True
            assert _.in_memory is False
            assert _.db_path   == self.path_local_db_rag
            assert _.tables_names() == ['config', 'embeddings']

    def test_add_content(self):
        content_db   = self.content_db()
        target_files = content_db.files__with_content()
        for file in target_files[0:10]:             #only process 10 files
            path     = file.get('path')
            contents = file.get('contents')
            self.logging.info(f'adding {path}')
            self.rag_db.add_content(path, contents)
        assert self.rag_db.table_embeddings().size() == 10
        assert self.rag_db.db_path                      == '/tmp/db_rag.sqlite'



    def test_add_content_rag_db__queries(self):
        queries = ["security", "How do I install it",
                   "I need markdown help", "I'm a portuguese journalist",
                   "TogetherAI", "Open Router", "Open AI",
                   "ABC", "OWASP", "Europe", "Cat", "Firewall", "Apple"]

        for query in queries:
            self.logging.info(f'adding {query}')
            self.rag_db__queries.add_content(query, query)

    def test_find_similarity(self):
        query = "ciso"
        embeddings_for_key = self.rag_db__queries.embeddings__for_key(query)
        similarities       = self.rag_db.find_similarities__from_embeddings(embeddings_for_key)

        found_keys = [key for similarity, key in similarities]
        assert found_keys == [ 'en/web-pages/demos/personas/ciso/ciso-mindmap.md']

        # for similarity, key in similarities:
        #     print(f'{similarity:.5f} : {key}')






