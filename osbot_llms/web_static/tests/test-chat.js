

  QUnit.module('chat.js', function(hooks) {

      hooks.beforeEach(function(assert) {
        const $response = $('<div id="response"></div>'); // Create a div for the responses and append it to the QUnit fixture
        $('#qunit-fixture').append($response);
      });

    QUnit.test('fetchStream', function(assert) {
        const done = assert.async();
        const $response = $('#response');
        $response.html('')
        assert.equal(fetchStream.name, 'fetchStream')

        user_prompt = "what is 40+2, only reply the answer"

        fetchStream(user_prompt).then(() => {
          console.log(`response: ${$response.text()} `)
          assert.equal(" : 42", $response.text())

          done()
        }).catch(e => {
          console.log(e)
          assert.ok(false, `Error in fetchStream: ${e}`);
          done()
      });
    });

});


QUnit.module('chat.js - loading UI', function(hooks) {

    hooks.beforeEach(function(assert) {
        const $response = $('<div id="chat-ui"></div>'); // Create a div for the responses and append it to the QUnit fixture
        $('#qunit-fixture').append($response);
      });

    QUnit.test('Load chat UI', function(assert) {
    var done = assert.async(); // Tell QUnit to wait for the async operation
        target_div = '#chat-ui'
        url_ui     = 'http://localhost:8000/static/chat.html'
        load_ui(target_div,url_ui)
            .then(() => {
                assert.ok(true, "...Load was performed successfully.");

                $html = $('#chat-ui')
                console.log($html.html())


                done(); // Resolve the async operation
            })
            .catch((error) => {
                assert.ok(false, "Load failed: " + error.message);
                done(); // Resolve the async operation
            });
    });

});


