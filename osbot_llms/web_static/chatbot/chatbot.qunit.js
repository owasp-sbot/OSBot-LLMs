QUnit.module('sample test', function(hooks) {
})


    // QUnit.skip('Confirm jquery is loaded', function (assert) {
    //     assert.equal('test 123', 'test 123')
    //     assert.equal($.fn.jquery, '3.7.1')
    //     console.log(document.location.href)
    //     console.log('asdaaa')
    // })

    QUnit.test('test loading chatbot.html', function (assert) {
        var virtual_path = "osbot_llms/web_static/chatbot"
        var page_path = `${virtual_path}/chatbot.html`
        var done = assert.async();
        $chatbot_div  = $('<div id=chatbot_div>')
        //$chatbot_div.load('chatbot.html') // how to debug this
        //assert.expect(0)
        $chatbot_div.load(page_path, function(response, status, xhr) {
            assert.equal(xhr.status    , 200)
            assert.equal(xhr.statusText, 'OK')
            assert.notEqual($chatbot_div.html(),'')
            console.log($chatbot_div.html())
            assert.equal('1','1')
            //
            done(); // Tells QUnit that you're done with async work
        });




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



    })
