module.exports = function () {
  return {
    "files": [
      "osbot_llms/web_static/aaa*.js"
    ],
    "tests": [
      "osbot_llms/web_static/tests/jas*.js"
    ],
    "testFramework": "jasmine",
    "env": {
      "kind": "chrome"
    }
  };
};