module.exports = function (wallaby) {
  return {
    "files": [
        {"pattern": "node_modules/jquery/dist/jquery.js"     , "instrument": false},
        {"pattern": "osbot_llms/web_static/src/chatbot/script.js", "load"      : false},
        "!osbot_llms/web_static/tests/**/*.*" ,
        "osbot_llms/web_static/**/*.*" ,

    ],
    "tests": [
        "!tests/web_static/_experiments/**/*.*",
        "tests/web_static/**/*.*",
        "osbot_llms/web_static/tests/**/*.*"
    ],
    "testFramework": "qunit",
    "env": {
      "kind": "chrome"
    },
    middleware: function (app, express) {
        const path            = require('path');
        const path_wallaby    = wallaby.localProjectDir
        const path_web_static = 'osbot_llms/web_static'
        const app_route       = '/static'
        const staticPath      = path.join(path_wallaby, path_web_static);

        app.use(app_route, express.static(staticPath));
    },
  };
};