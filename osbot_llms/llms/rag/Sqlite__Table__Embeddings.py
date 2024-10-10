from osbot_utils.base_classes.Type_Safe         import Type_Safe
from osbot_utils.helpers.sqlite.Sqlite__Table   import Sqlite__Table
from osbot_utils.utils.Misc                     import timestamp_utc_now
from osbot_utils.utils.Objects                  import pickle_save_to_bytes, pickle_load_from_bytes
from osbot_llms.llms.API_Open_AI                import API_Open_AI

SQLITE__TABLE_NAME__EMBEDDINGS  = 'embeddings'       # note: table name doesn't support the - char
EMBEDDINGS__DEFAULT__DIMENSIONS = 256

class Schema__Table__Embeddings(Type_Safe):
    key         : str           # index key
    content     : str
    dimensions  : int
    embeddings  : bytes          # todo: for now using pickle (see performance implication) and figure out a way to store the embeddings in a more native way (when trying to convert the embeddings int values into bytes and back to ints, the values didn't seem to be matching)
    model       : str
    provider    : str
    platform    : str
    timestamp   : int
    token_count : int


class Sqlite__Table__Embeddings(Sqlite__Table):
    api_open_api : API_Open_AI

    def __init__(self, **kwargs):
        self.table_name = SQLITE__TABLE_NAME__EMBEDDINGS
        self.row_schema  = Schema__Table__Embeddings
        super().__init__(**kwargs)

    def setup(self):
        if self.exists() is False:
            self.create()
            self.index_create('key')
        return self

    def embedding(self, key):
        return self.where_one(key=key)

    def embedding_not_exists(self, key):
        return self.embedding(key) is None

    def add_embeddings(self, key, content):
        platform         = "OpenAI (Paid)"
        provider         = "OpenAI"
        model            = 'text-embedding-3-small'
        dimensions       = EMBEDDINGS__DEFAULT__DIMENSIONS
        result           = self.api_open_api.embeddings(content, model, dimensions=dimensions)
        embeddings_data  = result.get('embeddings_data')
        embeddings       = pickle_save_to_bytes(embeddings_data)        # todo: document the security implications of using pickle
        token_count      = result.get('total_tokens'  )

        row_data = dict(key        = key                ,
                        content    = content            ,
                        dimensions = dimensions         ,
                        embeddings = embeddings         ,
                        model      = model              ,
                        provider   = provider           ,
                        platform   = platform           ,
                        timestamp  = timestamp_utc_now(),
                        token_count= token_count        )
        self.add_row_and_commit(**row_data)
        return embeddings_data
