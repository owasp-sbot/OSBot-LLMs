import WebC__Chat_Input     from '../../../src/html_blocks/web_components/WebC__Chat_Input.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Input', function(hooks) {

    // hooks.before((assert) => { });
    //
    // hooks.after((assert) => { });

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Chat_Input.element_name, 'webc-chat-input'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (WebC__Chat_Input.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.test('.event_dispatch',     (assert) => {
        const target_div        = WebC__Target_Div.add_to_body().build({width:"50%"})
        const web_chat_input    = target_div.append_child(WebC__Chat_Input)
        const message_to_send   = 'an sent message'
        const keyevent           = new KeyboardEvent('keydown')
        keyevent._key ='Enter'          // todo: replace with proper event dispatch

        //web_chat_bot.messages.add_message_received(received_message)
        var message_received = null
        window.addEventListener('new_input_message', (e)=>{
             message_received = e.detail
        });

        assert.equal(message_received, null)
        web_chat_input.input.value = message_to_send
        web_chat_input.input.dispatchEvent(keyevent)
        assert.equal(message_received, message_to_send)
        assert.equal(web_chat_input.input.value, '')

        target_div.remove()
    })

    QUnit.test('render', (assert) => {
        const div_setup = {top: "30%", width: "50%", bottom:"50%"}
        const target_div = WebC__Target_Div.add_to_body().build(div_setup)
        const web_chat_input = target_div.append_child(WebC__Chat_Input)
        const expected_html =
`<div class="chat-input">
    <input type="text" placeholder="Enter a message..."/>
</div>
`
        assert.equal(web_chat_input.html(), expected_html)

        window.web_chat_input = web_chat_input
        target_div.remove()
    })
})