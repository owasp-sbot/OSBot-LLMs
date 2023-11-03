

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

        user_prompt = "Hi"

        fetchStream(user_prompt).then(() => {
          console.log(`response: ${$response.text()} `)
          assert.equal(" : Hello! How can I assist you today?", $response.text())

          done()
        }).catch(e => {
          console.log(e)
          assert.ok(false, `Error in fetchStream: ${e}`);
          done()
      });
    });
});

