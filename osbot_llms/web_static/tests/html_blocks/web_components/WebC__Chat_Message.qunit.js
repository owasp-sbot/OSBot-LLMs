import WebC__Chat_Message   from '../../../src/html_blocks/web_components/WebC__Chat_Message.js'
import WebC__Target_Div     from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component        from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Chat_Message', function(hooks) {

    hooks.before((assert) => {
        this.element_name      = WebC__Chat_Message.element_name
        //this.webc_chat_message = WebC__Chat_Message.create_element_add_to_body() // document.body.appendChild(this.element_chat_bot);

        //this.remove_on_exit = true
    });

    hooks.after((assert) => {
        // assert.equal(document.querySelector(this.element_name), this.webc_chat_message)
        //  if (this.remove_on_exit) {
        //      this.webc_chat_message.remove()
        //  }
    });

    QUnit.test('constructor', (assert) => {
        assert.equal(this.element_name            , 'webc-chat-message'         , 'WebC__Chat_Message element name was correctly set'           )
        assert.ok   (this.webc_chat_message       instanceof WebC__Chat_Message , 'webc_chat_message is instance of WebC__Chat_Message'         )
        assert.ok   (WebC__Chat_Message.prototype instanceof Web_Component      , 'WebC__Chat_Message.prototype is an instance of Web_Component');
    })

    QUnit.only('add_target_div',  (assert) =>  {
        const target_div = WebC__Target_Div.add_to_body().build()
        window.target_div = target_div
        //window.webc_chat_message = this.webc_chat_message

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
        //const css_rules = webc_chat_message.css_messages()                                                //target_div.getRootNode().host.css_rules()
        const test_html =
`
<!--<div class="messages">-->
<!--    <div class="message received"">this is a message received</div>-->
<!--    <div class="message sent""    >this was sent</div>            -->
<!--</div>-->
`
        //target_div.add_css_rules(css_rules)
        //target_div.inner_html = 'test_html'
        //console.log(target_div.outerHTML)
        //console.log(target_div.shadowRoot.innerHTML)
        window.target_div = target_div

        const new_div = document.createElement('div')
        // new_div.innerHTML = 'aaaaa _ 123'
        // target_div.appendChild(document.createElement('hr'))
        // target_div.appendChild(new_div)
        // target_div.appendChild(document.createElement('hr'))

        const element = WebC__Chat_Message.create({inner_html: 'This is <br>sent', type:'sent', 'aaaaaa': 42})

        target_div.appendChild(element)

        const element_2 = WebC__Chat_Message.create({inner_html: 'this is <hr></hr>received', type:'received', 'aaaaaa': 42})

        target_div.appendChild(element_2)

        return

        const div_messages = target_div.shadow_root().querySelector('.messages')

        //const element = WebC__Chat_Message.create({inner_html: 'new element', type:'sent', 'aaaaaa': 42})
        //div_messages.appendChild(element)
        //div_messages.appendChild(element)
        console.log(target_div.shadow_root().appendChild(element))

        //target_div.appendChild(appendChild)
        target_div.append_child(WebC__Chat_Message)



        window.element = element
        window.div_messages = div_messages


        //element.shadowRoot.innerHTML = '<div class="message sent">an message inside...</div>'




        //webc_chat_message.set_inner_html('aaa')

        //console.log(webc_chat_message.shadow_root.innerHTML )
        // const target_div_2 = WebC__Target_Div.add_to_body().build({left:'10px', width:'15%'})
        // target_div_2.add_css_rules(css_rules)
        // target_div_2.target_element.innerHTML = test_html

        //target_div.remove()
    })
})