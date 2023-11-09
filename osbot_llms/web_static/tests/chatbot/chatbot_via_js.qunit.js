import Html  from '../../src/html_blocks/js/Html.js';

QUnit.module('chatbot-via-js', function(hooks) {


    hooks.before(function (assert) {
        const done = assert.async();
        if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {
            var virtual_path = "../../../../../OSBot-LLMs/osbot_llms/web_static/src/chatbot"
        } else {
            var virtual_path = "/static/src/chatbot"
        }
        //var virtual_path = "/static/src/chatbot"
        const page_path = `${virtual_path}/chatbot-control.html`
        $.get(page_path, (data) => {
            this.data = data
            done()
        });

    })

    QUnit.test('load data', function (assert) {
        const $data = $(this.data)
        assert.equal($data.html().includes('<ul class="chatbox'),true)
        assert.equal($data.find('.chatbox').length,1)
        $data.find('.chatbox').remove()
        $data.find('.chat-input').remove()
        assert.equal($data.find('.chatbox').length,0)
        assert.equal($data.html().includes('<ul class="chatbox'),false)
        //console.log($data.html())
    })

    QUnit.test('create chatbot html from js', function (assert) {
        const target_html_value =
`<div class="show-chatbot">
    <div class="chatbot">
        <header>
            <h2>Chatbot</h2>
            <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="material-symbols-outlined">smart_toy</span>
                <p>Hi there 👋<br>How can I help you today?</p>
            </li>
        </ul>
        <div class="chat-input">
            <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
            <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
    </div>
</div>
`
        const html_value =
`<div class="show-chatbot">
</div>`
        const html = new Html({value:html_value})
        assert.equal(html.html(), html_value)
        //console.log(html_value)
    })


})