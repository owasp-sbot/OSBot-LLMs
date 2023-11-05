module.exports = function (wallaby) {
  return {
    "files": [
        {"pattern": "node_modules/jquery/dist/jquery.js"         , "instrument": false},
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
        //const path_wallaby    = wallaby.localProjectDir
        const path_wallaby    = wallaby.projectCacheDir
        const path_web_static = 'osbot_llms/web_static'
        const app_route       = '/static'
        const staticPath      = path.join(path_wallaby, path_web_static);

        console.log(wallaby)        // output to Wallaby console the current config

        // use the code below to see all requests made to wallaby server (useful for debugging)
        // app.use('/*', function (req, res, next) {
        //     host     = req.headers.host
        //     base_url = req.baseUrl
        //     full_url = `http://${host}${base_url}`
        //     console.log(full_url)
        //     next()
        // });

        app.use(app_route, express.static(staticPath));     // support the dynammically loading of intrumented files
    },
  };
};