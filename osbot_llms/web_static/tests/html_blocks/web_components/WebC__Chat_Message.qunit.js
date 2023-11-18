import WebC__Chat_Message   from '../../../src/html_blocks/web_components/WebC__Chat_Message.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Message', function(hooks) {

    hooks.before((assert) => {
        this.element_name   = WebC__Chat_Message.element_name
        this.webc_chat_message = WebC__Chat_Message.create_element_add_to_body() // document.body.appendChild(this.element_chat_bot);

        this.remove_on_exit = true
    });

    hooks.after((assert) => {
        assert.equal(document.querySelector(this.element_name), this.webc_chat_message)
         if (this.remove_on_exit) {
             this.webc_chat_message.remove()
         }
    });

    QUnit.test('constructor', (assert) => {
        assert.equal(this.element_name            , 'webc-chat-message'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (this.webc_chat_message       instanceof WebC__Chat_Message , 'webc_chat_message is instance of WebC__Chat_Message'         )
        assert.ok   (WebC__Chat_Message.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.only('add_target_div',  (assert) => {
        const target_div = WebC__Target_Div.add_to_body().build()
        window.target_div = target_div
        window.webc_chat_message = this.webc_chat_message

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
        //this.webc_chat_message.add_css_rules(css_rules)
        const css_rules = webc_chat_message.css_messages()                                                //target_div.getRootNode().host.css_rules()
        const test_html =
`
<div class="messages">
    <div class="message received"">this is a message received</div>
    <div class="message sent""    >this was sent</div>
    <div class="message received"">this is a message received</div>
    <div class="message sent""    >this was sent</div>
    
</div>
`
        target_div.inner_html = test_html
        target_div.add_css_rules(css_rules)



        // const target_div_2 = WebC__Target_Div.add_to_body().build({left:'10px', width:'15%'})
        // target_div_2.add_css_rules(css_rules)
        // target_div_2.target_element.innerHTML = test_html

        //target_div.remove()
    })
})