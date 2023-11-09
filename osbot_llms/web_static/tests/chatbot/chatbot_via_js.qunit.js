QUnit.module('chatbot-via-js', function(hooks) {


    hooks.before(function (assert) {
        const done = assert.async();
        var virtual_path = "/static/src/chatbot"
        const page_path = `${virtual_path}/chatbot-control.html`
        $.get(page_path, (data) => {
            this.data = data
            done()
        });

    })

    QUnit.test('load data', function (assert) {
        $data = $(this.data)
        assert.equal($data.html().includes('<ul class="chatbox'),true)
        assert.equal($data.find('.chatbox').length,1)
        $data.find('.chatbox').remove()
        $data.find('.chat-input').remove()
        assert.equal($data.find('.chatbox').length,0)
        assert.equal($data.html().includes('<ul class="chatbox'),false)
        //console.log($data.html())
    })

    //todo add code to recreate chatbot-control.html in JS


})