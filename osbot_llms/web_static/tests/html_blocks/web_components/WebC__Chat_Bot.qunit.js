import WebC__Chat_Bot   from '../../../src/html_blocks/web_components/WebC__Chat_Bot.js'
import Web_Component    from '../../../src/html_blocks/web_components/Web_Component.js'
import Div              from "../../../src/html_blocks/js/Div.js";

QUnit.module('WebC__Chat_Bot', function(hooks) {

    hooks.before(() => {
        this.element_name = 'chat-bot'
        this.element_class = WebC__Chat_Bot

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
        assert.ok(this.dom_chat_bot        instanceof WebC__Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok(WebC__Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
    })


    QUnit.test('build',  async (assert) => {
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const chat_bot_id = 'test_chat_bot_build'
        const chat_bot_div = dom_chat_bot_1.build({chat_bot_id:chat_bot_id})
        assert.equal(chat_bot_div.id, chat_bot_id)
        assert.ok(chat_bot_div.innerHTML.includes('div class="chatbot-ui">'))
        chat_bot_div.remove()
        dom_chat_bot_1.remove()
        assert.equal(document.querySelectorAll('chat-bot').length, 1)
    })

    QUnit.test('test with chat bot',   async (assert) => {
        assert.equal(document.querySelectorAll('chat-bot').length, 1)
        console.log(document.querySelectorAll('chat-bot').length)
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_2 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_3 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_4 = document.body.appendChild(document.createElement(this.element_name));

        dom_chat_bot_1.build({left:"12px", right:null  , top: "10px", "bottom": null  , width:"45%", height:"45%"})
        dom_chat_bot_2.build({left:"12px", right:null  , top: null  , "bottom": "10px", width:"45%", height:"45%"})
        dom_chat_bot_3.build({left:null  , right:"12px", top: "10px", "bottom": null  , width:"45%", height:"45%"})
        dom_chat_bot_4.build({left:null  , right:"12px", top: null  , "bottom": "10px", width:"45%", height:"45%"})

        const dom_elements = document.querySelectorAll('chat-bot')
        assert.equal(dom_elements.length, 5)
        assert.equal(getComputedStyle(dom_elements[1].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[2].shadowRoot.children[0]).bottom, '10px')
        assert.equal(getComputedStyle(dom_elements[3].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[4].shadowRoot.children[0]).bottom, '10px')

        dom_chat_bot_1.remove()
        dom_chat_bot_2.remove()
        dom_chat_bot_3.remove()
        dom_chat_bot_4.remove()

        assert.equal(document.querySelectorAll('chat-bot').length, 1)
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
        const html_code = this.element_chat_bot.div_chatbot_ui().html()
        assert.equal(html_code, expected_html_code)
    })



    QUnit.test('test css_code',  (assert) => {
        const expected_css_rules =  { '.right-div'            : '.right-div { border: 3px solid blue; bottom: 12px; overflow: auto; position: fixed; right: 12px; top: 12px; width: 30%; z-index: 1000; background-color: white; }',
                                      '.container-full-height': '.container-full-height { display: flex; flex-direction: column; height: 100%; padding: 0px; }',
                                      '.flex-row'             : '.flex-row { flex: 1 1 0%; display: flex; }',
                                      '.flex-col'             : '.flex-col { flex: 1 1 0%; display: flex; padding: 0px; }',
                                      '.content-center': '.content-center { border: 3px solid red; flex-grow: 1; display: flex; justify-content: center; align-items: center; }' ,

                                     '*'                 : '* { font-family: Verdana; }',
                                      '.chatbot-ui'      : '.chatbot-ui { display: flex; flex: 1 1 0%; flex-direction: column; max-width: 100%; height: 100%; background-color: rgb(255, 255, 255); border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px; overflow: hidden; }',
                                      '.chat-header'     : '.chat-header { background-color: rgb(90, 74, 209); color: rgb(255, 255, 255); padding: 10px; text-align: center; font-size: 1.2em; }',
                                      '.chat-messages'   : '.chat-messages { display: flex; flex-direction: column; flex-grow: 1; padding: 10px; overflow-y: auto; }',
                                      '.message'         : '.message { margin-bottom: 10px; padding: 10px; border-radius: 20px; max-width: 80%; }',
                                      '.message.received': '.message.received { background-color: rgb(229, 229, 234); align-self: flex-start; }',
                                      '.message.sent'    : '.message.sent { background-color: rgb(75, 44, 116); align-self: flex-end; color: rgb(255, 255, 255); }',
                                      '.chat-input'      : '.chat-input { padding: 10px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.1) 0px -2px 10px; }',
                                      '.chat-input input': '.chat-input input { width: 90%; padding: 10px; border-radius: 20px; border: 1px solid rgb(204, 204, 204); }',
		                            }
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        dom_chat_bot_1.build({right:"12px", top:"12px" , bottom:"12px"})
        assert.propEqual(dom_chat_bot_1.all_css_rules(), expected_css_rules)
        dom_chat_bot_1.remove()

    })
})