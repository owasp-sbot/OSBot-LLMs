from osbot_utils.decorators.methods.cache_on_self import cache_on_self
from osbot_utils.utils.Misc                       import lower

class LLMs_API:

    def __init__(self):
        pass

    @cache_on_self
    def create_from_fastapi_routes(self, fast_api):

        open_api = fast_api.openapi()
        title    = open_api.get('info').get('title')
        paths    = self.extract_paths(open_api)
        tools    = self.extract_tools_from_paths(paths)
        llms_api = {'title': title, 'paths': paths, 'tools': tools}

        #pprint(open_api)


        return llms_api

    def extract_paths(self, open_api):
        paths = {}
        for path, methods in open_api.get('paths').items():
            for method, details in methods.items():
                params_query = {}
                params_path  = {}
                params_other = {}                               # todo: see if we need this
                name         = lower(details.get('summary').replace(' ', '_'))
                tool = {
                        "id"          : details.get('operationId'),
                        "description" : details.get('description'),
                        "method"      : method                    ,
                        "path"        : path                      ,
                        "params_query": params_query              ,
                        "params_path" : params_path               ,
                        "params_other": params_other              ,
                        "summary"     : details.get('summary'    ),
                    }
                for parameter in details.get('parameters', []):
                    title = parameter.get('schema').get('title')
                    param = { parameter.get('name') : {'description': title}}

                    if   parameter.get('in') == 'query': params_query.update(param)
                    elif parameter.get('in') == 'path' : params_path .update(param)
                    else                               : params_other.update(param)
                paths[name]=tool
        return paths


    def extract_tools_from_paths(self, paths):
        tools = []
        for path_name, path in paths.items():
            name        = path_name
            description = path.get('summary')  #+ ':\n' + path.get('description')
            params_other = path.get('params_other')
            params_path  = path.get('params_path')
            params_query = path.get('params_query')
            properties   = {**params_other , **params_path, **params_query}
            if properties:
                parameters = { "type" : "object"         ,
                               "properties": properties  }
            else:
                parameters = {}
            tool =  { "type"      : "function"                    ,
                      "function"  : { "name"       : name        ,
                                      "description": description ,
                                      "parameters" : parameters  }}
            tools.append(tool)
        return tools