QUnit.module('sample test', function(hooks) {

    QUnit.test('confirm that chatbot.html and script.js loads ok', function (assert) {
        var done = assert.async();
        var virtual_path = "/static/src/chatbot"                          // this works in qunit in browser at http://localhost:8000/static-tests/chatbot/test-chatbot.html
        var page_path = `${virtual_path}/chatbot.html`
        var div_id    = 'chatbot_div'
        $chatbot_div  = $(`<div id='${div_id}'>`)
        $chatbot_div.appendTo('body')
        assert.ok($(`#${div_id}`).is( $chatbot_div))



        $chatbot_div.load(page_path, function(response, status, xhr) {
            assert.equal(xhr.status    , 200)
            assert.equal(xhr.statusText, 'OK')
            assert.notEqual($chatbot_div.html(),'')


            //$('<div id=chatbot_div>').load(page_path).appendTo('body')

            $chatbot_div.show()

            //
            //$chatbot_div.remove()
            expected_script_js_vars = { chatbox         : {}     ,
                                        chatInput       : {}     ,
                                        sendChatBtn     : {}     ,
                                        userMessage     : null   ,
                                        API_KEY         : '.....',
                                        inputInitHeight : window.script_js_vars.inputInitHeight }
            assert.propEqual(window.script_js_vars, expected_script_js_vars)

            done(); // Tells QUnit that you're done with async work
        });

    })


        // // This callback function will be executed after the load completes
        //     console.log("status: " + status);
        //
        //         if (status === "error") {
        //             console.error("Error loading chatbot.html:", xhr.statusText);
        //         } else {
        //             // Log and assert only after the content has been loaded
        //             console.log($chatbot_div.html());
        //             // Perform your assertions here, for example:
        //             // assert.ok($chatbot_div.html().includes("expected content"), "The content should be loaded");
        //
        //             // Place your debug code here, or step through with a debugger
        //         }
        //

    QUnit.test('sending message', function (assert) {
        assert.expect(0)
        chatbox.append(createChatLi("this is a message from the test", "outgoing"))
        chatbox.append(createChatLi("this is a reply", "incoming"))
        chatbox.append(createChatLi("....another user quesiton", "outgoing"))
    })

    QUnit.test('confirm jquery is loaded',  function (assert) {
        jquery_version = '3.7.1'
        assert.equal($.fn.jquery, jquery_version,`confirmed that jQuery version is ${jquery_version}` )
        //console.log(document.location.href)
        //console.log('asdaaa')
    })
})


QUnit.done(function() {
  console.log('all tests are done, expanding all tests to show messages')
  document.querySelectorAll('.qunit-assert-list').forEach(function(element) {
    element.classList.remove('qunit-collapsed');

  });
});