import Chat_Bot             from '../../../src/html_blocks/web_components/Chat_Bot.js'
import Dynamic_Rows_Cols    from '../../../src/html_blocks/web_components/Dynamic_Rows_Cols.js'
import Div                  from "../../../src/html_blocks/js/Div.js";

QUnit.module('Dynamic_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'dynamic-rows-cols'
        this.element_class = Dynamic_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
    })

    hooks.after(() => {
        //this.dom_chat_bot.remove()
    })

    QUnit.test('build', async (assert) => {
        this.dom_chat_bot.create_target_div()
        this.dom_chat_bot.build()
        assert.ok(true)
    })


    QUnit.skip('test with chat bot', async (assert) => {
        this.dom_chat_bot.create_target_div()
        //this.dom_chat_bot.build()
        const div_container = new Div({id: 'container_div', class: 'container-full-height'})
        div_container
            .add_div({class: 'flex-row'})
            .add_div({class: 'flex-col'})
            .add_div({class: 'content-center'})

        const container_html = div_container.html()
        const target_div = this.dom_chat_bot.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = container_html

        const html_code =
`<div class="chatbot-ui">
  <div class="chat-header">Chatbot</div>
  <div class="chat-messages">
    <div class="message received">Hi there 👋<br>How can I help you today?</div>
    <div class="message sent">!this is a message from the test</div>
    <div class="message received">this is a reply</div>
    <div class="message sent">...another user question</div>
    <div class="message received">this is a reply asa alsdj ladj lkajsdlkasd klas sdlfhsd gfhsau </div>
    <div class="message sent">...another user question asldkjalsdkj alskdj aslkd alskdj as</div>
    
  </div>
  <div class="chat-input">
    <input type="text" placeholder="Enter a message..." />
  </div>
</div>`
        const css_code =
`
* {
 font-family: 'Verdana'
}
.chatbot-ui {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  height: 100%; /* Adjust to the height of the content-center div */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.chat-header {
  background-color: #5a4ad1;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 1.2em;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 20px;
  max-width: 80%;
}

.message.received {
  background-color: #e5e5ea;
  align-self: flex-start;
}

.message.sent {
  background-color: #4b2c74;
  align-self: flex-end;
  color: #fff;
}

.chat-input {
  padding: 10px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.chat-input input {
  width: 90%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
}

`

        //const  content_center = this.dom_chat_bot.shadowRoot.querySelector('.content-center')
        target_div.innerHTML= `<style>${css_code}</style>${html_code}`
        assert.ok(true)
    })
    //
    //
    //     customElements.define('chat-bot', Chat_Bot);
    //
    //     const element_chat_bot = document.createElement('chat-bot')
    //     element_chat_bot.build()
    //     const  content_center = this.dom_chat_bot.shadowRoot.querySelector('.content-center')
    //     content_center.appendChild(element_chat_bot)
    //     console.log(content_center.innerHTML)
    //
    //
    //     assert.ok(true)
    // })
})