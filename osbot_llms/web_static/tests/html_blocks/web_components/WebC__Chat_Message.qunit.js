import WebC__Chat_Messages  from '../../../src/html_blocks/web_components/WebC__Chat_Messages.js'
import WebC__Chat_Message   from '../../../src/html_blocks/web_components/WebC__Chat_Message.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Message', function(hooks) {

    hooks.before((assert) => { });

    hooks.after((assert) => { });

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Chat_Message.element_name            , 'webc-chat-message'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (WebC__Chat_Message.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.test('.add_message_sent, add_message_received', (assert) =>  {
        const target_div = WebC__Target_Div.add_to_body().build()
        assert.propEqual(target_div.css_rules(), { ".target_div": { border         : "3px solid #724ae8",
                                                                   bottom         : "10px"             ,
                                                                   left           : null               ,
                                                                   overflow       : "auto"             ,
                                                                   position       : "fixed"            ,
                                                                   right          : "10px"             ,
                                                                   top            : "10px"             ,
                                                                   height         : null               ,
                                                                   width          : '70%'              ,
                                                                   zIndex         : "1000"             ,
                                                                   backgroundColor: "white"            }})
        const chat_messages = WebC__Chat_Messages.create()
        const message_1     = 'This is \nsent'
        const message_2     = 'this is <br>received...123'
        const message_3     = {user_prompt: 'hello' }
        const message_4     = 'good morning \n\nwith new lines'
        const element       = WebC__Chat_Message.create({inner_html: message_1, type:'sent'    , 'the_answer': 42})
        const element_2     = WebC__Chat_Message.create({inner_html: message_2, type:'received'})

        chat_messages.appendChild          (element  )
        chat_messages.appendChild          (element_2)
        chat_messages.add_message_sent     (message_3)
        chat_messages.add_message_received (message_4)

        target_div.appendChild(chat_messages)
        const message = chat_messages.messages()
        assert.equal(message[0].message()                  , message_1 )
        assert.equal(message[0].attributes.the_answer.value, 42        )
        assert.equal(message[0].attributes.type.value      , 'sent'    )

        assert.equal(message[1].message()                  , message_2 )
        assert.equal(message[1].attributes.type.value      , 'received')

        assert.equal(message[2].message()                  , message_3.user_prompt )
        assert.equal(message[2].attributes.type.value      , 'sent')

        const message_4_formated = message_4.replace(/\n/g, '<br>'                                        )
        assert.equal(message[3].message()                  , message_4_formated, 'message was formated ok')
        assert.equal(message[3].attributes.type.value      , 'received'                                   )

        target_div.remove()
    })

    QUnit.test('html',  (assert) =>    {
        const webc_chat_message = WebC__Chat_Message.create()
        const expected_html =
`<div class="message ${webc_chat_message.type}">
    <slot>
    </slot>
</div>
`
        assert.equal(webc_chat_message.html(),expected_html)
        //assert.ok(1)
    })

    QUnit.test('.show_message',  async (assert) => {
        const div_setup = {top: "200px"}
        const target_div        = WebC__Target_Div.add_to_body().build(div_setup)
        const web_chat_messages = target_div.append_child(WebC__Chat_Messages)

        // adding full messages
        const url_markdown        = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
        const message_raw         = { user_prompt:'this is **bold** in markdown\n\nnew line'}
        const message_html_lite   = 'this is **bold** in markdown<br><br>new line'
        const message_html_marked = '<p>this is <strong>bold</strong> in markdown</p>\n<p>new line</p>\n'

        const chat_message_without_marked = web_chat_messages.add_message_sent(message_raw)
        assert.equal(chat_message_without_marked.message_raw , message_raw.user_prompt      )
        assert.equal(chat_message_without_marked.message_html ,message_html_lite)

        // load marked js and eval it
        assert.equal(window.marked, undefined, "maked api is not loaded")
        await fetch(url_markdown).then(response => response.text().then(text => eval(text)))
        assert.notEqual(window.marked, undefined, "maked api is now loaded")

        const chat_message_with_marked = web_chat_messages.add_message_sent(message_raw)
        assert.equal(chat_message_with_marked.message_raw , message_raw.user_prompt    )
        assert.equal(chat_message_with_marked.message_html ,message_html_marked)

        // adding a streamed message
        const message_streamed             = ['this '         , 'is '              , '\n\n a new line'                   ]
        const message_streamed_raw         = ['this '         , 'this is '         ,  'this is \n\n a new line'          ]
        const message_streamed_html_marked = ['<p>this </p>\n', '<p>this is </p>\n', '<p>this is </p>\n<p> a new line</p>\n']

        const chat_message_with_marked_streamed = web_chat_messages.add_message_sent({user_prompt: message_streamed[0]})
        assert.equal(chat_message_with_marked_streamed.message_raw , message_streamed_raw        [0])
        assert.equal(chat_message_with_marked_streamed.message_html ,message_streamed_html_marked[0])

        for (let i = 1; i < 3; i++) {
            chat_message_with_marked_streamed.append(message_streamed[i])
            assert.equal(chat_message_with_marked_streamed.message_raw , message_streamed_raw        [i])
            assert.equal(chat_message_with_marked_streamed.message_html ,message_streamed_html_marked[i])
        }

        //todo add test to check that table is loaded ok using the code below
//         const message_with_marked_table_raw =
// `| Subject | Answer |
// |-----------|------------------------------------|
// | Markdown | Yes, I can help you with Markdown. |`

        //const received_chat_message_with_marked_table = web_chat_messages.add_message_sent    (message_with_marked_table_raw)
        //const sent_chat_message_with_marked_table     = web_chat_messages.add_message_received(message_with_marked_table_raw)

        target_div.remove()
        delete window.marked
        assert.equal(window.marked, undefined, "maked api is not available anymore")

    })

    QUnit.test('.show_message with images',  async (assert) => {
        const target_div        = WebC__Target_Div.add_to_body().build()
        const web_chat_messages = target_div.append_child(WebC__Chat_Messages)
        const test_image        = create_test_img_base64()
        const message = {user_prompt: 'this is a message with an image',images:[test_image]}
        web_chat_messages.add_message_sent(message)
        assert.ok(1)
        target_div.remove()

    })
})

//todo: move to util class
function create_test_img_base64(width=50, height=30, color='#496D89') {
    var canvas    = document.createElement('canvas');       // Create a canvas element
    canvas.width  = width;
    canvas.height = height;
    var ctx       = canvas.getContext('2d');                // Get the context of the canvas
    ctx.fillStyle = color;                                  // Fill the canvas with the specified color
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();                              // Convert the canvas to a base64 encoded image
}