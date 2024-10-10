import Data__Chat_Bot      from "../../../src/html_blocks/data/Data__Chat_Bot.js";
import WebC__Chat_Bot      from '../../../src/html_blocks/web_components/WebC__Chat_Bot.js'
import WebC__Target_Div    from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import WebC__Chat_Messages from '../../../src/html_blocks/web_components/WebC__Chat_Messages.js'
import Web_Component       from '../../../src/html_blocks/web_components/Web_Component.js'

QUnit.module('WebC__Chat_Bot', function(hooks) {

    QUnit.test('constructor', (assert) => {
        const webc_chat_bot = WebC__Chat_Bot.create()
        assert.ok   (webc_chat_bot       instanceof WebC__Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok   (WebC__Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
        assert.ok   (webc_chat_bot.data_chat_bot  instanceof Data__Chat_Bot)
    })


    QUnit.test('build',  async (assert) => {
        const target_div   = WebC__Target_Div.add_to_body().build({width:"50%"})
        const web_chat_bot = WebC__Chat_Bot.create()

        target_div.appendChild(web_chat_bot)
        const chat_messages = web_chat_bot.query_selector('#chat_messages')
        chat_messages.add_message_sent      ('ping'    )
        chat_messages.add_message_received  ('pong'    )
        chat_messages.add_message_sent      ('sent'    ).append(' abc.....123').append(' 123\n'.repeat(12))
        chat_messages.add_message_received  ('received').append(' xyz.....123').append(' 123\n'.repeat(12))
        chat_messages.add_message_sent      ('sent'    ).append(' abc.....123').append(' 123\n'.repeat(12))
        assert.equal(chat_messages.messages().length, 6)
        target_div.remove()

        // todo add asserts like the one below to make sure the elements are loading ok

        // const dom_chat_bot = WebC__Chat_Bot.create_element_add_to_body()
        //
        // const chat_bot_div = dom_chat_bot.build({chat_bot_id:chat_bot_id})
        // assert.equal(chat_bot_div.id, chat_bot_id)
        // assert.ok(chat_bot_div.innerHTML.includes('div class="chatbot-ui">'))
        // assert.equal(dom_chat_bot.target_element       , chat_bot_div)
        // return
        // assert.equal(dom_chat_bot.shadowRoot.firstChild, chat_bot_div)
        // assert.equal(dom_chat_bot.innerHTML, '')
        // //dom_chat_bot.remove()
    })

    QUnit.test('create 4 chat bot',  async (assert) => {
        const remove_web_components  = true

        //todo: refactor into a helper that creates the div with less code in the test
        function add_chat_box(...kwargs) {
            const target_div    = WebC__Target_Div.add_to_body().build(...kwargs)
            const webc_chat_bot = WebC__Chat_Bot.create()
            target_div.appendChild(webc_chat_bot)
            return webc_chat_bot
        }

        assert.equal(document.querySelectorAll(WebC__Target_Div.element_name).length, 0)
        const webc_chat_bot_1 = add_chat_box({left:"12px", right:null  , top: "10px", "bottom": null  , width:"45%", height:"45%"})
        const webc_chat_bot_2 = add_chat_box({left:"12px", right:null  , top: null  , "bottom": "10px", width:"45%", height:"45%"})
        const webc_chat_bot_3 = add_chat_box({left:null  , right:"12px", top: "10px", "bottom": null  , width:"45%", height:"45%"})
        const webc_chat_bot_4 = add_chat_box({left:null  , right:"12px", top: null  , "bottom": "10px", width:"45%", height:"45%"})
        assert.equal(document.querySelectorAll(WebC__Target_Div.element_name).length, 4)

        const dom_elements = document.querySelectorAll(WebC__Target_Div.element_name)
        assert.equal(dom_elements.length, 4)
        assert.equal(getComputedStyle(dom_elements[0].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[1].shadowRoot.children[0]).bottom, '10px')
        assert.equal(getComputedStyle(dom_elements[2].shadowRoot.children[0]).top   , '10px')
        assert.equal(getComputedStyle(dom_elements[3].shadowRoot.children[0]).bottom, '10px')

        webc_chat_bot_1.messages.add_message_sent    ('sent in 1'         )
        webc_chat_bot_2.messages.add_message_received('reveived in 2'     )
        webc_chat_bot_3.messages.add_message_sent    ('sent in 3'         )
        webc_chat_bot_4.messages.add_message         ('not specified in 4')
        window.webc_chat_bot_1 = webc_chat_bot_1


        if (remove_web_components) {
            webc_chat_bot_1.parent_element().remove()
            webc_chat_bot_2.parent_element().remove()
            webc_chat_bot_3.parent_element().remove()
            webc_chat_bot_4.parent_element().remove()

            assert.equal(document.querySelectorAll(WebC__Target_Div.element_name).length, 0)
        } else {
            assert.equal(document.querySelectorAll(WebC__Target_Div.element_name).length, 4)
        }
    })

    QUnit.test('test html_code',  (assert)=>{
        const webc_chat_bot = WebC__Chat_Bot.create()

        const expected_html_code =
`<div class="chatbot-ui">
    <div class="chat-header">ChatBot</div>
    <webc-chat-messages id="chat_messages" class="chat-messages">
    </webc-chat-messages>
    <webc-chat-input id="chat_input">
    </webc-chat-input>
</div>`
        const html_code = webc_chat_bot.div_chatbot_ui().html()
        assert.equal(html_code, expected_html_code)
    })



    QUnit.test('test css_code',   (assert) => {
        const target_div    = WebC__Target_Div.add_to_body().build({width:"200px"})
        const webc_chat_bot = WebC__Chat_Bot.create()
        target_div.appendChild(webc_chat_bot)
        const expect_css__target_div      = { ".target_div": ".target_div { border: 3px solid rgb(114, 74, 232); bottom: 10px; overflow: auto; position: fixed; right: 10px; top: 10px; width: 200px; z-index: 1000; background-color: white; }" }

        const expected_css__webc_chat_bot =  { '*'                 : '* { font-family: Verdana; }',
                                                '.chatbot-ui'      : '.chatbot-ui { display: flex; flex: 1 1 0%; flex-direction: column; max-width: 100%; height: 100%; background-color: rgb(255, 255, 255); border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px; overflow: hidden; }',
                                                '.chat-header'     : '.chat-header { background-color: rgb(90, 74, 209); color: rgb(255, 255, 255); padding: 10px; text-align: center; font-size: 1.2em; }',
                                                '.chat-messages'   : '.chat-messages { display: flex; flex-direction: column; flex-grow: 1; padding: 10px; overflow-y: auto; }',
                                                '.chat-input'      : '.chat-input { padding: 10px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.1) 0px -2px 10px; }',
                                                '.chat-input input': '.chat-input input { width: 90%; padding: 10px; border-radius: 20px; border: 1px solid rgb(204, 204, 204); }',
		                                      }

        assert.propEqual(target_div.all_css_rules()   , expect_css__target_div     )
        assert.propEqual(webc_chat_bot.all_css_rules(), expected_css__webc_chat_bot)
        target_div.remove()
    })

    QUnit.test('.hook_events',    (assert) => {
        const target_div        = WebC__Target_Div.add_to_body().build({width:"50%"})
        const web_chat_bot      = target_div.append_child(WebC__Chat_Bot)
        const message_to_send   = 'an sent message'
        const received_message  = 'Hi how can I help'
        const keyevent           = new KeyboardEvent('keydown')
        keyevent._key ='Enter'          // todo: replace with proper event dispatch

        web_chat_bot.messages.add_message_received(received_message)
        assert.ok(1)
        web_chat_bot.input.value = message_to_send
        web_chat_bot.input.dispatchEvent(keyevent)

        assert.equal(web_chat_bot.messages.childNodes.length, 3)
        assert.equal(web_chat_bot.messages.childNodes[0].data    , '\n    ')
        assert.equal(web_chat_bot.messages.childNodes[0].nodeName, '#text')
        assert.equal(web_chat_bot.messages.childNodes[1].message(), received_message)
        assert.equal(web_chat_bot.messages.childNodes[2].message(), message_to_send)

        target_div.remove()
    })

    QUnit.test('main UI workflow',   (assert) => {
        const target_div        = WebC__Target_Div.add_to_body().build({width:"50%"})
        const web_chat_bot      = target_div.append_child(WebC__Chat_Bot)
        target_div.remove()
        assert.ok(1)
    })
})








    // todo: re-add this capability to load messages from saved data
    //
    // QUnit.test('.store_message',  async (assert)=> {
    //     const message      = "an user message"
    //     const type         = "sent"
    //     const user_message = {message: message, type:type}
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [])
    //
    //     assert.equal(this.webc_chat_bot.store_message(message, type), this.webc_chat_bot)
    //
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [user_message])
    //     assert.equal(this.webc_chat_bot.data_chat_bot.remove_user_message(message, type), this.webc_chat_bot.data_chat_bot)
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.system_prompts, [])
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages , [])
    // })


    // QUnit.test('.messages__add',  async (assert)=> {
    //     const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
    //     const chat_bot_top = '20%'
    //     dom_chat_bot_1.build({top: chat_bot_top, left:'10px', width:null, right:'10px', bottom:'10px'})
    //
    //     const delay     = 0 // 300
    //
    //     // 1st sent/receive pair
    //     const sent_1    = 'ping'
    //     const received_1 = 'pong'
    //     const expected_user_messages_1 = [{message: sent_1, type:'sent'}, {message: received_1, type:'received'}]
    //     dom_chat_bot_1.messages__add_sent   (sent_1)
    //     dom_chat_bot_1.messages__add_received(received_1)
    //     assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_1)
    //
    //     // 2nd sent/receive pair
    //     const sent_2    = 'ping, with some \n new\nlines'
    //     const received_2 = 'pong, with also \n new \n lines'
    //     const expected_user_messages_2 = [...expected_user_messages_1, {message: sent_2, type:'sent'}, {message: received_2, type:'received'}]
    //     dom_chat_bot_1.messages__add_sent    (sent_2)
    //     dom_chat_bot_1.messages__add_received(received_2)
    //     assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_2)
    //
    //     // 3rd sent/receive pair
    //     const sent_3     = 'abc xyz '.repeat (50)
    //     const received_3 = 'ok'
    //     const expected_user_messages_3 = [...expected_user_messages_2, {message: sent_3, type:'sent'}, {message: received_3, type:'received'}]
    //     await dom_chat_bot_1.wait_for(delay)
    //     dom_chat_bot_1.messages__add_sent(sent_3)
    //     await dom_chat_bot_1.wait_for(delay)
    //     dom_chat_bot_1.messages__add_received(received_3)
    //     assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_3)
    //
    //     // 4th sent/receive pair
    //     const sent_4     = 'one more message '
    //     const received_4 = '.. an big response ...\n'.repeat (20)
    //     const expected_user_messages_4 = [...expected_user_messages_3, {message: sent_4, type:'sent'}, {message: received_4, type:'received'}]
    //     await dom_chat_bot_1.wait_for(delay)
    //     dom_chat_bot_1.messages__add_sent(sent_4)
    //     await dom_chat_bot_1.wait_for(delay)
    //     dom_chat_bot_1.messages__add_received(received_4)
    //     assert.propEqual(dom_chat_bot_1.data_chat_bot.user_messages, expected_user_messages_4)
    //
    //     dom_chat_bot_1.remove()
    //     assert.ok(true)
    // })
    //
    // QUnit.test('.set_user_messages',  async (assert)=> {
    //     const data_chat_bot = new Data__Chat_Bot()
    //     const message_sent_1     = 'sent 1'
    //     const message_received_1 = 'received 1'
    //     const message_sent_2     = 'sent 2'
    //     const message_received_2 = 'received 2'
    //     data_chat_bot.add_user_message_sent     (message_sent_1)
    //     data_chat_bot.add_user_message_received (message_received_1)
    //     data_chat_bot.add_user_message_sent     (message_sent_2)
    //     data_chat_bot.add_user_message_received (message_received_2)
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages, [])
    //
    //
    //     assert.equal(this.webc_chat_bot.style_computed.top, this.webc_chat_bot.css_rules__target_div()[".right-div" ].top , ".right-div styles have been applied ")
    //     const margin = '20px'
    //     this.webc_chat_bot.style.top    = margin
    //     this.webc_chat_bot.style.right  = margin
    //     this.webc_chat_bot.style.bottom = margin
    //     this.webc_chat_bot.style.width  = '50%'
    //
    //     assert.equal(this.webc_chat_bot.style_computed.top   , margin)
    //     assert.equal(this.webc_chat_bot.style_computed.right , margin)
    //     assert.equal(this.webc_chat_bot.style_computed.bottom, margin)
    //
    //
    //     window.webc_chat_bot = this.webc_chat_bot
    //
    //     //add once
    //     assert.equal    (data_chat_bot.user_messages.length                               , 4                           )
    //     assert.equal    (this.webc_chat_bot.set_user_messages(data_chat_bot.user_messages), this.webc_chat_bot          )
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages               , data_chat_bot.user_messages )
    //     assert.equal    (this.webc_chat_bot.div_chat_messages.children.length             , 4                          )
    //
    //     // add again (with one extra message
    //
    //     data_chat_bot.add_user_message_received('one more received')
    //     assert.equal    (data_chat_bot.user_messages.length                               , 5                           )
    //     assert.equal    (this.webc_chat_bot.set_user_messages(data_chat_bot.user_messages), this.webc_chat_bot          )
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages                   , data_chat_bot.user_messages )
    //     assert.equal    (this.webc_chat_bot.div_chat_messages.children.length             , 5                           )
    //
    //     // reseting user messages and confirming there are none showing
    //     assert.equal(this.webc_chat_bot.reset_user_messages()                             , this.webc_chat_bot          )
    //     assert.propEqual(this.webc_chat_bot.data_chat_bot.user_messages                   , []                          )
    //     assert.equal    (data_chat_bot.user_messages.length                               , 5                           )
    //     assert.ok(true)
    // })
    //
    // QUnit.test('.message__update',  async (assert)=> {
    //     const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
    //     const chat_bot_top = '10%'
    //     dom_chat_bot_1.build({top: chat_bot_top, left:'10px', width:null, right:'10px', bottom:'10px'})
    //     dom_chat_bot_1.messages__add_sent('Hello')
    //     dom_chat_bot_1.messages__add_received('Good morning')
    //     dom_chat_bot_1.remove()
    //     assert.ok(true)
    // })
