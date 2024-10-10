from osbot_utils.decorators.methods.cache_on_self   import cache_on_self
from osbot_utils.helpers.sqlite.domains.Sqlite__DB  import Sqlite__DB
from osbot_utils.utils.Objects import pickle_load_from_bytes

from osbot_llms.llms.API_Open_AI import API_Open_AI
from osbot_llms.llms.rag.Sqlite__Table__Embeddings import Sqlite__Table__Embeddings



TABLE_NAME__RAG__RAG_DATA       = 'rag_data'
TABLE_NAME__RAG__RAG_EMBEDDINGS = 'rag_embeddings'


class RAG__DB__Sqlite(Sqlite__DB):
    api_open_ai : API_Open_AI

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    # def tables_to_add(self):
    #     return { TABLE_NAME__RAG__RAG_DATA: TABLE_SCHEMA__RAG_DATA }

    @cache_on_self
    def table_embeddings(self):
        return Sqlite__Table__Embeddings(database=self)

    def add_content(self, title, content):
        with self.table_embeddings() as _:
            if _.embedding_not_exists(title):
                return _.add_embeddings(title, content)

    def embeddings__for_key(self, key, add_if_not_found=True):
        row = self.table_embeddings().where_one(key=key)
        if row:
            embeddings_bytes = row.get('embeddings')
            return pickle_load_from_bytes(embeddings_bytes)
        else:
            if add_if_not_found:
                return self.add_content(key,key)
            else:
                return []

    def embeddings__all_rows(self):
        all_embeddings = {}
        for row in self.table_embeddings().rows():
            embeddings_bytes    = row.get('embeddings')
            key                 = row.get('key')
            embeddings          = pickle_load_from_bytes(embeddings_bytes)
            all_embeddings[key] = embeddings
        return all_embeddings

    def find_similarities__from_embeddings(self, embeddings_to_match, threshold=0.4):
        import numpy as np
        def cosine_similarity(a, b):
            return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

        similarities = []
        for key, embeddings in self.embeddings__all_rows().items():
            similarity = cosine_similarity(embeddings_to_match, embeddings)
            if similarity > threshold:
                similarities.append((similarity, key))
        similarities.sort(reverse=True, key=lambda x: x[0])
        return similarities

    def similarities_content(self, similarities):
        result = {}
        with self.table_embeddings() as _:
            for key, similarity in similarities:
                content = _.where_one(key=key)

    def setup(self):
        super().setup()
        self.table_embeddings().setup()
        return self