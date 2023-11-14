import Chat_Bot         from '../../../src/html_blocks/web_components/Chat_Bot.js'
import Web_Component    from '../../../src/html_blocks/web_components/Web_Component.js'
import Div              from "../../../src/html_blocks/js/Div.js";

QUnit.module('Chat_Bot', function(hooks) {

    hooks.before(() => {
        this.element_name = 'chat-bot'
        this.element_class = Chat_Bot

        customElements.define(this.element_name, this.element_class);

        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot = document.body.appendChild(this.element_chat_bot);
        this.remove_on_exit = true
    });

    hooks.after((assert) => {
        assert.equal(document.querySelector(this.element_name), this.dom_chat_bot)
        if (this.remove_on_exit) {
            this.dom_chat_bot.remove()
            //assert.equal(document.querySelector(this.element_name), null)
        }
    });

    QUnit.test('constructor', (assert) => {
        assert.ok(this.dom_chat_bot instanceof Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok(Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
    })


    QUnit.test('test with chat bot',  async (assert) => {
        assert.ok(true)
        return
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_2 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_3 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_4 = document.body.appendChild(document.createElement(this.element_name));
        dom_chat_bot_1.create_target_div({right:"12px"})
        dom_chat_bot_2.create_target_div({right:"250px"})
        dom_chat_bot_3.create_target_div({right:"450px"})
        dom_chat_bot_4.create_target_div({right:"850px"})

        dom_chat_bot_1.build()
        dom_chat_bot_2.build()
        dom_chat_bot_3.build()
        dom_chat_bot_4.build()
        assert.ok(true)
    })

    QUnit.test('test html_code', (assert)=>{

        const expected_html_code =
`<div class="chatbot-ui">
    <div class="chat-header">Chatbot</div>
    <div class="chat-messages">
        <div class="message received">Hi there 👋<br>How can I help you today?</div>
        <div class="message sent">what is 40+2</div>
        <div class="message received">the sum is 42</div>
        <div class="message sent">thanks</div>
        <div class="message received">you're welcome</div>
    </div>
    <div class="chat-input">
        <input type="text" placeholder="Enter a message..."/>
    </div>
</div>`
        assert.ok(1)
        const html_code = this.element_chat_bot.html_code()

        //console.log(html_code)

        assert.equal(html_code, expected_html_code)

        this.element_chat_bot.set_inner_html(html_code)

        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        dom_chat_bot_1.create_target_div({right:"12px", top:"12px" , bottom:"12px"})
        dom_chat_bot_1.build()

    })



    QUnit.test('test css_code',  (assert) => {
        const expected_css_rules =  { '.right-div'            : '.right-div { border: 3px solid blue; bottom: 12px; overflow: auto; position: fixed; right: 12px; top: 12px; width: 30%; z-index: 1000; background-color: white; }',
                                      '.container-full-height': '.container-full-height { display: flex; flex-direction: column; height: 100%; padding: 0px; }',
                                      '.flex-row'             : '.flex-row { flex: 1 1 0%; display: flex; }',
                                      '.flex-col'             : '.flex-col { flex: 1 1 0%; display: flex; padding: 0px; }',
                                      '.content-center': '.content-center { border: 3px solid red; flex-grow: 1; display: flex; justify-content: center; align-items: center; }' ,

                                     '*'                 : '* { font-family: Verdana; }',
                                      '.chatbot-ui'      : '.chatbot-ui { display: flex; flex-direction: column; max-width: 100%; height: 100%; background-color: rgb(255, 255, 255); border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px; overflow: hidden; }',
                                      '.chat-header'     : '.chat-header { background-color: rgb(90, 74, 209); color: rgb(255, 255, 255); padding: 10px; text-align: center; font-size: 1.2em; }',
                                      '.chat-messages'   : '.chat-messages { display: flex; flex-direction: column; flex-grow: 1; padding: 10px; overflow-y: auto; }',
                                      '.message'         : '.message { margin-bottom: 10px; padding: 10px; border-radius: 20px; max-width: 80%; }',
                                      '.message.received': '.message.received { background-color: rgb(229, 229, 234); align-self: flex-start; }',
                                      '.message.sent'    : '.message.sent { background-color: rgb(75, 44, 116); align-self: flex-end; color: rgb(255, 255, 255); }',
                                      '.chat-input'      : '.chat-input { padding: 10px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.1) 0px -2px 10px; }',
                                      '.chat-input input': '.chat-input input { width: 90%; padding: 10px; border-radius: 20px; border: 1px solid rgb(204, 204, 204); outline: currentcolor; }',
		                            }
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        dom_chat_bot_1.create_target_div({right:"12px", top:"12px" , bottom:"12px"})
        dom_chat_bot_1.build()
        assert.propEqual(dom_chat_bot_1.css_rules(), expected_css_rules)
        window.dom_chat_bot_1 = dom_chat_bot_1
        dom_chat_bot_1.remove()

    })
})