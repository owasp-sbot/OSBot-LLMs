import Data__Chat_Bot   from "../../../src/html_blocks/data/Data__Chat_Bot.js";
import WebC__Chat_Bot   from '../../../src/html_blocks/web_components/WebC__Chat_Bot.js'
import Web_Component    from '../../../src/html_blocks/web_components/Web_Component.js'

QUnit.module('WebC__Chat_Bot', function(hooks) {

    hooks.before((assert) => {
        this.element_name = WebC__Chat_Bot.element_name //'chat-bot'
        this.element_class = WebC__Chat_Bot

        //this.element_chat_bot = WebC__Chat_Bot.create_element()
        //assert.equal(typeof(this.element_chat_bot.add_target_div), 'function')
        this.webc_chat_bot = WebC__Chat_Bot.create_element_add_to_body() // document.body.appendChild(this.element_chat_bot);
        this.webc_chat_bot.build()
        this.remove_on_exit = true
    });

    hooks.after((assert) => {
        assert.equal(this.webc_chat_bot.data_chat_bot.user_messages.length, 0                 ,  "there were no messages left in data_chat_bot")
        assert.equal(document.querySelector(this.element_name)            , this.webc_chat_bot)
        if (this.remove_on_exit) {
            this.webc_chat_bot.remove()
        }
    });

    QUnit.test('constructor', (assert) => {
        assert.ok   (this.webc_chat_bot       instanceof WebC__Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok   (WebC__Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
        assert.ok   (this.webc_chat_bot.data_chat_bot  instanceof Data__Chat_Bot)
        assert.ok   (this.webc_chat_bot.target_element instanceof HTMLDivElement)
    })


    QUnit.test('build',  async (assert) => {
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const chat_bot_id = 'test_chat_bot_build'
        const chat_bot_div = dom_chat_bot_1.build({chat_bot_id:chat_bot_id})
        assert.equal(chat_bot_div.id, chat_bot_id)
        assert.ok(chat_bot_div.innerHTML.includes('div class="chatbot-ui">'))
        assert.equal(dom_chat_bot_1.target_element       , chat_bot_div)
        assert.equal(dom_chat_bot_1.shadowRoot.firstChild, chat_bot_div)
        chat_bot_div.remove()
        dom_chat_bot_1.remove()
        assert.equal(document.querySelectorAll(this.element_name).length, 1)
    })

    QUnit.test('test with chat bot',   async (assert) => {
        assert.equal(document.querySelectorAll(this.element_name).length, 1)
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_2 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_3 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_4 = document.body.appendChild(document.createElement(this.element_name));

        dom_chat_bot_1.build({left:"12px", right:null  , top: "10px", "bottom": null  , width:"45%", height:"45%"})
        dom_chat_bot_2.build({left:"12px", right:null  , top: null  , "bottom": "10px", width:"45%", height:"45%"})
        dom_chat_bot_3.build({left:null  , right:"12px", top: "10px", "bottom": null  , width:"45%", height:"45%"})
        dom_chat_bot_4.build({left:null  , right:"12px", top: null  , "bottom": "10px", width:"45%", height:"45%"})

        const dom_elements = document.querySelectorAll(this.element_name)
        assert.equal(dom_elements.length, 5)
        assert.equal(getComputedStyle(dom_elements[1].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[2].shadowRoot.children[0]).bottom, '10px')
        assert.equal(getComputedStyle(dom_elements[3].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[4].shadowRoot.children[0]).bottom, '10px')

        dom_chat_bot_1.remove()
        dom_chat_bot_2.remove()
        dom_chat_bot_3.remove()
        dom_chat_bot_4.remove()

        assert.equal(document.querySelectorAll(this.element_name).length, 1)
        assert.ok(true)
    })

    QUnit.test('test html_code', (assert)=>{

        const expected_html_code =
`<div class="chatbot-ui">
    <div class="chat-header">Chatbot</div>
    <div class="chat-messages">
    </div>
    <div class="chat-input">
        <input type="text" placeholder="Enter a message..."/>
    </div>
</div>`
        const html_code = this.webc_chat_bot.div_chatbot_ui().html()
        assert.equal(html_code, expected_html_code)
    })



    QUnit.test('test css_code',   (assert) => {
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

    QUnit.test('.templates_html', (assert)=> {
        var expected_template_html =
`<div id="templates">
    <template id="template_sent">
        <div class="message sent"></div>
    </template>
    <template id="template_received">
        <div class="message received"></div>
    </template>
</div>
`
        const templates_html = this.webc_chat_bot.templates_html()
        assert.equal(templates_html, expected_template_html)

    })

    //todo finish implementation
    QUnit.test('.store_message',  async (assert)=> {
        const message      = "an user message"
        const type         = "sent"
        const user_message = {message: message, type:type}
        assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [])

        assert.equal(this.webc_chat_bot.store_message(message, type), this.webc_chat_bot)

        assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [user_message])
        assert.equal(this.webc_chat_bot.data_chat_bot.remove_user_message(message, type), this.webc_chat_bot.data_chat_bot)
        assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [])
    })


    QUnit.test('.messages__add',  async (assert)=> {
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const chat_bot_top = '20%'
        dom_chat_bot_1.build({top: chat_bot_top, left:'10px', width:null, right:'10px', bottom:'10px'})

        const delay     = 0 // 300

        // 1st sent/receive pair
        const sent_1    = 'ping'
        const received_1 = 'pong'
        const expected_user_messages_1 = [{message: sent_1, type:'sent'}, {message: received_1, type:'received'}]
        dom_chat_bot_1.messages__add_sent   (sent_1)
        dom_chat_bot_1.messages__add_received(received_1)
        assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_1)

        // 2nd sent/receive pair
        const sent_2    = 'ping, with some \n new\nlines'
        const received_2 = 'pong, with also \n new \n lines'
        const expected_user_messages_2 = [...expected_user_messages_1, {message: sent_2, type:'sent'}, {message: received_2, type:'received'}]
        dom_chat_bot_1.messages__add_sent    (sent_2)
        dom_chat_bot_1.messages__add_received(received_2)
        assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_2)

        // 3rd sent/receive pair
        const sent_3     = 'abc xyz '.repeat (50)
        const received_3 = 'ok'
        const expected_user_messages_3 = [...expected_user_messages_2, {message: sent_3, type:'sent'}, {message: received_3, type:'received'}]
        await dom_chat_bot_1.wait_for(delay)
        dom_chat_bot_1.messages__add_sent(sent_3)
        await dom_chat_bot_1.wait_for(delay)
        dom_chat_bot_1.messages__add_received(received_3)
        assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_3)

        // 4th sent/receive pair
        const sent_4     = 'one more message '
        const received_4 = '.. an big response ...\n'.repeat (20)
        const expected_user_messages_4 = [...expected_user_messages_3, {message: sent_4, type:'sent'}, {message: received_4, type:'received'}]
        await dom_chat_bot_1.wait_for(delay)
        dom_chat_bot_1.messages__add_sent(sent_4)
        await dom_chat_bot_1.wait_for(delay)
        dom_chat_bot_1.messages__add_received(received_4)
        assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_4)

        dom_chat_bot_1.remove()
        assert.ok(true)
    })

    QUnit.test('.set_user_messages',  async (assert)=> {
        const data_chat_bot = new Data__Chat_Bot()
        const message_sent_1     = 'sent 1'
        const message_received_1 = 'received 1'
        const message_sent_2     = 'sent 2'
        const message_received_2 = 'received 2'
        data_chat_bot.add_user_message_sent     (message_sent_1)
        data_chat_bot.add_user_message_received (message_received_1)
        data_chat_bot.add_user_message_sent     (message_sent_2)
        data_chat_bot.add_user_message_received (message_received_2)
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages, [])


        assert.equal(this.webc_chat_bot.style_computed.top, this.webc_chat_bot.css_rules__target_div()[".right-div" ].top , ".right-div styles have been applied ")
        const margin = '20px'
        this.webc_chat_bot.style.top    = margin
        this.webc_chat_bot.style.right  = margin
        this.webc_chat_bot.style.bottom = margin
        this.webc_chat_bot.style.width  = '50%'

        assert.equal(this.webc_chat_bot.style_computed.top   , margin)
        assert.equal(this.webc_chat_bot.style_computed.right , margin)
        assert.equal(this.webc_chat_bot.style_computed.bottom, margin)


        window.webc_chat_bot = this.webc_chat_bot

        //add once
        assert.equal    (data_chat_bot.user_messages.length                               , 4                           )
        assert.equal    (this.webc_chat_bot.set_user_messages(data_chat_bot.user_messages), this.webc_chat_bot          )
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages               , data_chat_bot.user_messages )
        assert.equal    (this.webc_chat_bot.div_chat_messages.children.length             , 4                          )

        // add again (with one extra message

        data_chat_bot.add_user_message_received('one more received')
        assert.equal    (data_chat_bot.user_messages.length                               , 5                           )
        assert.equal    (this.webc_chat_bot.set_user_messages(data_chat_bot.user_messages), this.webc_chat_bot          )
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages                   , data_chat_bot.user_messages )
        assert.equal    (this.webc_chat_bot.div_chat_messages.children.length             , 5                           )

        // reseting user messages and confirming there are none showing
        assert.equal(this.webc_chat_bot.reset_user_messages()                             , this.webc_chat_bot          )
        assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages                   , []                          )
        assert.equal    (data_chat_bot.user_messages.length                               , 5                           )
        assert.ok(true)
    })

    //todo: finish method implementation
    QUnit.test('.message__update',  async (assert)=> {
        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const chat_bot_top = '10%'
        dom_chat_bot_1.build({top: chat_bot_top, left:'10px', width:null, right:'10px', bottom:'10px'})
        dom_chat_bot_1.messages__add_sent('Hello')
        dom_chat_bot_1.messages__add_received('Good morning')
        dom_chat_bot_1.remove()
        assert.ok(true)
    })
})