QUnit.module('sample test', function(hooks) {

    hooks.before(function(assert) {
        //console.log('before test execution')
        var done = assert.async();
        var this_closure=this
        var virtual_path = "/static/src/chatbot"                          // this works in qunit in browser at http://localhost:8000/static-tests/chatbot/test-chatbot.html
        var page_path = `${virtual_path}/chatbot.html`

        this.div_id    = 'chatbot_div'
        this.$chatbot_div  = $(`<div id='${this.div_id}'>`)
        this.$chatbot_div.appendTo('body')
        //assert.ok($(`#${div_id}`).is( this.$chatbot_div))

        this.$chatbot_div.load(page_path, function(response, status, xhr) {
            this_closure.response     = response
            this_closure.status       = status
            this_closure.xhr          = xhr

            console.log(`[hooks.before]: page loaded ok ${page_path}`)
            done()
        })

     })

    hooks.after(function(assert) {
         console.log('[hooks.after]: before after test execution')
     })

    QUnit.test('check chatbot.html was loaded ok',  function (assert) {
        assert.equal   (this.xhr.status         , 200 , "xhr.status is 200"            )
        assert.equal   (this.xhr.statusText     , 'OK', 'xhr.statusText is OK'         )
        assert.notEqual(this.$chatbot_div.html(), ''  , 'chatbot_div.html is not empty')
        assert.ok($(`#${this.div_id}`).is( this.$chatbot_div), `div_id ${this.div_id} is in the DOM`)

        expected_script_js_vars = { chatbox         : {}     ,
                                    chatInput       : {}     ,
                                    sendChatBtn     : {}     ,
                                    userMessage     : null   ,
                                    API_KEY         : '.....',
                                    inputInitHeight : window.script_js_vars.inputInitHeight }
        assert.propEqual(window.script_js_vars, expected_script_js_vars)
    })

    QUnit.test('sending message',  function (assert)  {
        assert.expect(0)
        chatbox        = document.querySelector(".chatbox");
        // console.log(chatbox)
        // console.log(createChatLi("this is a message from the test", "outgoing",42).outerHTML)
        // console.log('13')
        chatbox.append(createChatLi("!!this is a message from the test", "outgoing"))
        chatbox.append(createChatLi("this is a reply", "incoming"))
        chatbox.append(createChatLi("....another user quesiton", "outgoing"))
    })

    QUnit.test('confirm jquery is loaded', function (assert) {
        jquery_version = '3.7.1'
        assert.equal($.fn.jquery, jquery_version,`confirmed that jQuery version is ${jquery_version}` )
    })
})


QUnit.done(function() {
  console.log('[QUnit.done]: all tests are done, expanding all tests to show messages')
  document.querySelectorAll('.qunit-assert-list').forEach(function(element) {
    element.classList.remove('qunit-collapsed');

  });
});