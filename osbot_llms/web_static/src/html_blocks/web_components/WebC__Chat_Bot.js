import Data__Chat_Bot from "../data/Data__Chat_Bot.js";
import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";
import Tag from "../js/Tag.js";

export default class WebC__Chat_Bot extends Web_Component {
    constructor() {
        super();
        this.target_element     = null
        this.div_chat_messages  = null
        this.data_chat_bot      = new Data__Chat_Bot()
    }

    //static fields and methods
    static element_name  = 'webc-chat-bot'

    static define() {
       if (!customElements.get(WebC__Chat_Bot.element_name)) {
           customElements.define(WebC__Chat_Bot.element_name, WebC__Chat_Bot);
           return true; }
    }

    static create_element() {
        WebC__Chat_Bot.define()
        return document.createElement(WebC__Chat_Bot.element_name)
    }
    static create_element_add_to_body() {
        const element = WebC__Chat_Bot.create_element()
        return  document.body.appendChild(element);
    }

    // properties
    get style() {
        return this.target_element.style
    }
    get style_computed() {
        return getComputedStyle(this.target_element)
    }

    // instance methods

    add_target_div({chat_bot_id, ...kwargs}={}) {
        const css_rules__target_div = this.css_rules__target_div(kwargs)
        this.add_css_rules(css_rules__target_div)
        const div_target_div = this.div_target_div(chat_bot_id)
        this.set_inner_html(div_target_div.html())
    }

    add_chat_bot_to_element(element) {
        const css_rules__chat_bot = this.css_rules__chat_bot()
        this.add_css_rules(css_rules__chat_bot)
        const div_chatbot_ui = this.div_chatbot_ui()
        const templates_html = this.templates_html()
        element.innerHTML    = div_chatbot_ui.html() + templates_html
        this.set_target_element(element)
        return element
    }

    add_chat_bot_to_target_div(chat_bot_id) {
        const element    = this.shadowRoot.getElementById(chat_bot_id)
        return this.add_chat_bot_to_element(element)

    }

    build({chat_bot_id="chat_bot_id", ...kwargs}={}) {
        this.add_target_div({chat_bot_id, ...kwargs})
        return this.add_chat_bot_to_target_div(chat_bot_id)
    }

    css_rules__chat_bot() {
        return {    "*"              : { "font-family": "Verdana"},
                    ".chatbot-ui"    : { display: "flex",
                                         flex: 1,
                                         "flex-direction": "column",
                                         "max-width": "100%",
                                         height: "100%", // Adjust to the height of the content-center div
                                         "background-color": "#fff",
                                         "border-radius": "10px",
                                         "box-shadow": "0 0 10px rgba(0,0,0,0.1)",
                                         overflow: "hidden"},
                    ".chat-header"   : { "background-color": "#5a4ad1",
                                         color: "#fff",
                                         padding: "10px",
                                         "text-align": "center",
                                         "font-size": "1.2em" },
                    ".chat-messages" : { display: "flex",
                                        "flex-direction": "column",
                                         "flex-grow": "1",
                                         padding: "10px",
                                         "overflow-y": "auto" },
                    ".message"       : { "margin-bottom": "10px",
                                         padding: "10px",
                                         "border-radius": "20px",
                                         "max-width": "80%"},
                    ".message.received": { "background-color": "#e5e5ea",
                                           "align-self": "flex-start" },
                    ".message.sent"  : { "background-color": "#4b2c74",
                                        "align-self": "flex-end",
                                         color: "#fff"   },
                    ".chat-input"    : { padding: "10px",
                                         background: "#fff",
                                         "box-shadow": "0 -2px 10px rgba(0,0,0,0.1)" },
                    ".chat-input input": {  width: "90%",
                                            padding: "10px",
                                            "border-radius": "20px",
                                            border: "1px solid #ccc",
                                        //    outline: "currentcolor"       // this was inconsistent in Safari and Firefox
                                        }};}

    css_rules__target_div({right="60px" , left=null, width="30%", top="60px", bottom="120px", height=null}={}) {
        return {    ".right-div"     : { border         : "3px solid blue",
                                         bottom         : bottom    ,
                                         left           : left      ,
                                         overflow       : "auto"    ,
                                         position       : "fixed"   ,
                                         right          : right     ,
                                         top            : top       ,
                                         height         : height    ,
                                         width          : width     ,
                                         "z-index"      : "1000"    ,
                                         backgroundColor: "white"   },
                    ".container-full-height": {
                                         display:            "flex",
                                         "flex-direction":   "column",
                                         height:             "100%",
                                         padding:            "0"  },
                    ".flex-row"      : { flex:               "1",
                                         display:            "flex" },
                    ".flex-col"      : { flex:               "1",
                                         display:            "flex",
                                         padding:            "0"  },
                    ".content-center": { border:             "3px solid red",
                                         "flex-grow":        "1",
                                         display:            "flex",
                                         "justify-content":  "center",
                                         "align-items":      "center" } };
    }

    div_chatbot_ui() {
        const tag = new Tag()
        tag.html_config.include_id=false

        const div_chatbot_ui    = tag.clone({tag:'div', class:'chatbot-ui'   })
        const div_chat_header   = tag.clone({tag:'div', class:'chat-header'  , value:'Chatbot'})
        const div_chat_messages = tag.clone({tag:'div', class:'chat-messages'})
        const div_chat_input    = tag.clone({tag:'div', class:'chat-input'})
        const input_chat_input  = tag.clone({tag:'input', attributes:{type:'text', placeholder:'Enter a message...'}})

        div_chatbot_ui    .add(div_chat_header  )
        div_chatbot_ui    .add(div_chat_messages)
        div_chatbot_ui    .add(div_chat_input)
        div_chat_input.add(input_chat_input)

        div_chatbot_ui.html_config.trim_final_html_code        = true
        input_chat_input.html_config.include_end_tag           = false
        return div_chatbot_ui
    }

    div_target_div(chat_bot_id) {
        return new Div({id:chat_bot_id, class:'right-div'})
    }

    hide() {
        this.hidden = true
        return this
    }

    load_messages(user_messages) {
        user_messages.forEach((item) => {
            if (item.type === 'sent') {
                this.messages__add_sent(item.message)
            }
            if (item.type === 'received') {
                this.messages__add_received(item.message)
            }
        });
        return this
    }

    set_user_messages(user_messages) {
        //this.data_chat_bot.user_messages = user_messages            // set data_chat_bot.user_messages value
        this.reset_user_messages()
        this.load_messages(user_messages)                           // reload messages in UI
        return this
    }

    set_target_element(element){
        this.target_element     = element
        this.div_chat_messages = this.target_element.querySelector('.chat-messages')
    }

    show() {
        this.hidden = false
        return this
    }

    reset_user_messages() {
        this.data_chat_bot.user_messages = []
        webc_chat_bot.div_chat_messages.innerHTML =''
        // while (webc_chat_bot.div_chat_messages.childNodes.length > 0) {
        //      webc_chat_bot.div_chat_messages.removeChild(webc_chat_bot.div_chat_messages.childNodes[0]);
        // }
        return this
    }

    store_message(message, type) {
        this.data_chat_bot.add_user_message(message, type)
        return this
    }

    templates_html() {
        const templates                 = new Tag({tag:'div'     , id   :'templates'                    })
        const template_sent             = new Tag({tag:'template', id   :'template_sent'                })
        const template_sent_message     = new Tag({tag:'div'     , class:'message sent'     , value:''  })
        const template_received         = new Tag({tag:'template', id   :'template_received'            })
        const template_received_message = new Tag({tag:'div'     , class:'message received'   , value:''})

        template_sent_message    .html_config.include_id = false
        template_received_message.html_config.include_id = false

        templates        .add(template_sent             )
        templates        .add(template_received         )
        template_sent    .add(template_sent_message     )
        template_received.add(template_received_message )
        return templates.html()
    }

    messages__add(template, message) {
        const formatted_message = message.replace(/\n/g, '<br>');
        const new_message = template.content.cloneNode(true)
        new_message.querySelector('.message').innerHTML = formatted_message;
        const document_fragment = this.div_chat_messages.appendChild(new_message);
        this.div_chat_messages.scrollTop = this.div_chat_messages.scrollHeight;      // todo: add check if we should do this
        return document_fragment
    }

    messages__add_sent (message) {
        const template = this.target_element.querySelector('#template_sent') //.content.cloneNode(true);
        this.messages__add(template, message)
        this.data_chat_bot.add_user_message(message, 'sent')
    }

    messages__add_received (message) {
        const template = this.target_element.querySelector('#template_received') //.content.cloneNode(true);
        this.messages__add(template, message)
        this.data_chat_bot.add_user_message(message, 'received')
    }
}