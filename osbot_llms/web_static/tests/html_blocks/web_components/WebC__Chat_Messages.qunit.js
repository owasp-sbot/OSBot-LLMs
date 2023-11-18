import WebC__Chat_Messages  from '../../../src/html_blocks/web_components/WebC__Chat_Messages.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Messages', function(hooks) {

    hooks.before((assert) => { });

    hooks.after((assert) => { });

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Chat_Messages.element_name, 'webc-chat-messages'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (WebC__Chat_Messages.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.test('add_target_div', async (assert) =>  {
        assert.ok(true)

        const target_div       = WebC__Target_Div.add_to_body().build()
        const chat_messages    = WebC__Chat_Messages.create()

        target_div.appendChild(chat_messages)

        const sent_message     = 'a new SENT message'
        const received_message = 'a new SENT message'
        const exta_message     = '... added to message...'
        const message_sent     = chat_messages.add_message_sent    (sent_message)
        const message_received = chat_messages.add_message_received(received_message)

        assert.equal(message_sent.message()     , sent_message)
        assert.equal(message_received.message(), received_message)
        message_sent.append(exta_message)
        assert.equal(message_sent.message()    , sent_message + exta_message, "message_sent has both messages now")
        assert.equal(message_received.message(), received_message           , "message_received wasn't impacted" )
        target_div.remove()
    })
})