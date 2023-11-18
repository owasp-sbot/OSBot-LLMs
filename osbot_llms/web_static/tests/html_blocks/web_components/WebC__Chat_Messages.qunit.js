import WebC__Chat_Message   from '../../../src/html_blocks/web_components/WebC__Chat_Message.js'
import WebC__Chat_Messages  from '../../../src/html_blocks/web_components/WebC__Chat_Messages.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Message', function(hooks) {

    hooks.before((assert) => { });

    hooks.after((assert) => { });

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Chat_Messages.element_name, 'webc-chat-messages'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (WebC__Chat_Messages.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.test('add_target_div', async (assert) =>  {
        assert.ok(true)

        const target_div            = WebC__Target_Div.add_to_body().build()
        const inner_html            = ""
        const chat_messages         = WebC__Chat_Messages.create({inner_html: inner_html})
        const chat_message_sent     = WebC__Chat_Message.create({inner_html: 'new element sent', type:'sent'})
        const chat_message_received = WebC__Chat_Message.create({inner_html: 'new element received', type:'received'})

        target_div.appendChild   (chat_messages)
        chat_messages.appendChild(chat_message_sent)
        //await chat_messages.wait_for(500)
        chat_messages.appendChild(chat_message_received)

        target_div.remove()
    })
})