from osbot_utils.utils.Misc import obj_info
from starlette.routing import Mount

from osbot_utils.utils.Dev import pprint

FAST_API_DEFAULT_ROUTES_PATHS   = ['/docs', '/docs/oauth2-redirect', '/openapi.json', '/redoc']
FAST_API_DEFAULT_ROUTES         = [ { 'http_methods': ['GET','HEAD'], 'http_path': '/openapi.json'         , 'method_name': 'openapi'              },
                                    { 'http_methods': ['GET','HEAD'], 'http_path': '/docs'                 , 'method_name': 'swagger_ui_html'      },
                                    { 'http_methods': ['GET','HEAD'], 'http_path': '/docs/oauth2-redirect' , 'method_name': 'swagger_ui_redirect'  },
                                    { 'http_methods': ['GET','HEAD'], 'http_path': '/redoc'                , 'method_name': 'redoc_html'           }]
FAST_API_LLMS_DEFAULT_ROUTES    = [ { 'http_methods': ['GET'       ], 'http_path': '/'                     , 'method_name': 'redirect_to_docs'     }]
FAST_API_LLMS_STATIC_ROUTES     = [ { 'http_methods': ['GET','HEAD'], 'http_path': '/static'               , 'method_name': 'static'               },
                                    { 'http_methods': ['GET','HEAD'], 'http_path': '/static-tests'         , 'method_name': 'static_tests'         }]

def fastapi_routes(router, include_default=False):
    routes = []
    for route in router.routes:
        if include_default is False and route.path in FAST_API_DEFAULT_ROUTES_PATHS:
            continue
        if type(route) is Mount:
            methods = ['GET', 'HEAD']
        else:
            methods = sorted(route.methods)
        route = {"http_path": route.path, "method_name": route.name, "http_methods": methods}
        routes.append(route)
    return routes


# def fastapi_routes_list(**kwargs):
#     items = []
#     for route in fastapi_routes(**kwargs):
#         for http_methods in route.get('http_methods'):
#             item = f'{http_methods:4} | {route.get("method_name"):14} | {route.get("http_path")}'
#             items.append(item)
#     return items