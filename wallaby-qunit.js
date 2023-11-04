module.exports = function () {
  return {
    "files": [
        {"pattern": "node_modules/jquery/dist/jquery.js", "instrument": false},
        "osbot_llms/web_static/chatbot/chatbot.html" ,
        "osbot_llms/web_static/test_wallaby/calculatorModel.js",
        "osbot_llms/web_static/test_wallaby/calculatorView.js" ,
        "osbot_llms/web_static/test_wallaby/template.js"
    ],
    "tests": [
        "osbot_llms/web_static/chatbot/chatbot.qunit.js",
        "osbot_llms/web_static/test_wallaby/calculatorQUnitSpec.js"

    ],
    "testFramework": "qunit",
    "env": {
      "kind": "chrome"
    }
  };
};