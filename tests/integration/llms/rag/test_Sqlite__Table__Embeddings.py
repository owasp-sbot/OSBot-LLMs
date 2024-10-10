import pytest
from unittest import TestCase

from osbot_utils.utils.Dev import pprint

from osbot_llms.llms.rag.Sqlite__Table__Embeddings import Sqlite__Table__Embeddings, SQLITE__TABLE_NAME__EMBEDDINGS


#@pytest.mark.skip("Needs RAQ embeddings db")
class test_Sqlite__Table__Embeddings(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.table_embeddings = Sqlite__Table__Embeddings().setup()

    def test___init__(self):
        with self.table_embeddings as _:
            assert _.exists() is True
            assert _.table_name == SQLITE__TABLE_NAME__EMBEDDINGS
            assert _.schema__by_name_type() == { 'content'    : 'TEXT'   ,
                                                 'dimensions' : 'INTEGER',
                                                 'embeddings' : 'BLOB'   ,
                                                 'id'         : 'INTEGER',
                                                 'key'        : 'TEXT'   ,
                                                 'model'      : 'TEXT'   ,
                                                 'platform'   : 'TEXT'   ,
                                                 'provider'   : 'TEXT'   ,
                                                 'timestamp'  : 'INTEGER',
                                                 'token_count': 'INTEGER'}
            assert _.new_row_obj().__locals__() == { 'content'    : ''  ,
                                                     'dimensions' : 0   ,
                                                     'embeddings' : b'' ,
                                                     'key'        : ''  ,
                                                     'model'      : ''  ,
                                                     'platform'   : ''  ,
                                                     'provider'   : ''  ,
                                                     'timestamp'  : 0   ,
                                                     'token_count': 0   }
            assert _.indexes() == ['idx__embeddings__key']
            assert _.database.in_memory is True

    def test_add_embeddings(self):
        key     = 'an_file'
        content = "This is some text"
        with self.table_embeddings as _:
            result = _.add_embeddings(key, content)
            row    = _.where_one(key=key)

            assert type(result) is list
            assert len(result ) == 256
            #assert result   == {'data': None, 'error': None, 'message': '', 'status': 'ok'}
            assert _.rows() == [row]
            assert row      == {'content'    : 'This is some text'     ,
                                'dimensions' : 256                     ,
                                'embeddings' : row.get('embeddings')   ,
                                'id'         : 1                       ,
                                'key'        : 'an_file'               ,
                                'model'      : 'text-embedding-3-small',
                                'platform'   : 'OpenAI (Paid)'         ,
                                'provider'   : 'OpenAI'                ,
                                'timestamp'  : row.get('timestamp')    ,
                                'token_count': 4                       }

