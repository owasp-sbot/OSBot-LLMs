import WebC__Chat_Input     from '../../../src/html_blocks/web_components/WebC__Chat_Input.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Input', function(hooks) {

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Chat_Input.element_name, 'webc-chat-input'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (WebC__Chat_Input.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.test('.event_dispatch',     (assert) => {
        const target_div        = WebC__Target_Div.add_to_body().build({width:"50%"})
        const web_chat_input    = target_div.append_child(WebC__Chat_Input)
        const message_to_send   = 'an sent message'
        const expected_message  = {"images": [], user_prompt: message_to_send }
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
        assert.propEqual(message_received, expected_message)
        assert.equal(web_chat_input.input.value, '')

        target_div.remove()
    })

    QUnit.test('render', (assert) => {
        const div_setup = {top: "30%", width: "50%", bottom:"50%"}
        const target_div = WebC__Target_Div.add_to_body().build(div_setup)
        const web_chat_input = target_div.append_child(WebC__Chat_Input)
        const expected_html =
`<div class="chat-input">
    <div class="chat-images">
    </div>
    <input type="text" placeholder="Enter a message..."/>
</div>
`
        assert.equal(web_chat_input.html(), expected_html)

        window.web_chat_input = web_chat_input
        target_div.remove()
    })

    QUnit.test('Create test image', (assert) => {
        var base64Image      = create_test_img_base64(200,500);
        const div_setup      = {top: "200px"}
        const target_div     = WebC__Target_Div.add_to_body().build(div_setup)
        const web_chat_input = target_div.append_child(WebC__Chat_Input)
        assert.equal(web_chat_input.images.children.length, 0)
        web_chat_input.displayImage(base64Image)
        const img = web_chat_input.images.children[0]
        const style = "width:auto; height:auto; margin:10px;max-width:150px;max-height:150px"
        assert.equal(img.outerHTML,`<img src="${base64Image}" style="${style}">`)
        assert.equal(web_chat_input.images.children.length, 1)
        assert.equal(img.src,base64Image)
        window.web_chat_input = web_chat_input

        // trigger an sendmessage event
        window.addEventListener('new_input_message', (e)=>{
             //console.log(e.detail)
        });
        const keyevent           = new KeyboardEvent('keydown')
        keyevent._key            ='Enter'          // todo: replace with proper event dispatch
        web_chat_input.input.value = 'now with an image'
        web_chat_input.input.dispatchEvent(keyevent)
        assert.equal(web_chat_input.images.children.length, 0)
        target_div.remove()
    })

    //todo: fixing this test
    QUnit.only('Add button to upload image', (assert) => {
        //var base64Image      = create_test_img_base64(200,500);
        const target_div     = WebC__Target_Div.add_to_body().build({top: "200px"})
        const web_chat_input = target_div.append_child(WebC__Chat_Input)
        const chat_input = web_chat_input.query_selector('.chat-input')
        //chat_input.innerHTML = html

        //console.log(input)
        //console.log(html)
        target_div.remove()
        assert.ok(1)
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