import Data__Chat_Bot      from "../data/Data__Chat_Bot.js";
import Web_Component       from "./Web_Component.js";
import WebC__Chat_Messages from "./WebC__Chat_Messages.js";
import Tag                 from "../js/Tag.js";

export default class WebC__Chat_Bot extends Web_Component {
    constructor() {
        super();
        this.target_element     = null
        //this.div_chat_messages  = null
        this.data_chat_bot      = new Data__Chat_Bot()
    }

    connectedCallback() {
        this.build()
    }

    build() {
        this.add_css_rules(this.css_rules__chat_bot())
        const html = this.div_chatbot_ui().html()
        this.set_inner_html(html)
        this.add_event_hooks()
    }

    // properties

    get input() {
        return this.query_selector('input')
    }

    get messages() {
        return this.query_selector('#chat_messages')        //todo: refactor chat_messages
    }

    get target_element_style() {
        return this.target_element?.style
    }

    get target_element_style_computed() {
        return getComputedStyle(this.target_element)
    }

    // instance methods

    add_event_hooks() {
        this.input.addEventListener('keydown',(e) => this.on_input_keydown(e))
    }

    on_input_keydown(e) {
        // todo: remove e_.key once test event trigger is working
        if(e.key === "Enter" || e._key === "Enter") {         //  todo: add this when we have support for textarea as the bot input:    && !e.shiftKey
            this.messages.add_message_sent(this.input.value)
            this.input.value  =''
        }
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
                    // todo: refactor to chat-input WebC
                    ".chat-input"    : { padding: "10px",
                                         background: "#fff",
                                         "box-shadow": "0 -2px 10px rgba(0,0,0,0.1)" },
                    ".chat-input input": {  width: "90%",
                                            padding: "10px",
                                            "border-radius": "20px",
                                            border: "1px solid #ccc",
                                        }};}

    div_chatbot_ui() {

        const tag = new Tag()
        const chat_messages__element_name = WebC__Chat_Messages.element_name
        const chat_messages__id           = 'chat_messages'

        tag.html_config.include_id=false

        const div_chatbot_ui     = tag.clone({tag:'div'                      , class:'chatbot-ui'                           })
        const div_chat_header    = tag.clone({tag:'div'                      , class:'chat-header'  , value:'Chatbot'       })
        const webc_chat_messages = new Tag  ({tag:chat_messages__element_name, class:'chat-messages', id: chat_messages__id })
        const div_chat_input     = tag.clone({tag:'div'                      , class:'chat-input'                           })
        const input_chat_input   = tag.clone({tag:'input'                    , attributes:{type:'text', placeholder:'Enter a message...'}})

        div_chatbot_ui.add(div_chat_header  )
        div_chatbot_ui.add(webc_chat_messages)
        div_chatbot_ui.add(div_chat_input)
        div_chat_input.add(input_chat_input)

        div_chatbot_ui  .html_config.trim_final_html_code = true
        input_chat_input.html_config.include_end_tag    = false
        return div_chatbot_ui
    }

    hide() {
        this.hidden = true
        return this
    }


    show() {
        this.hidden = false
        return this
    }

    // todo: re-add this capability to load messages from saved data
    //
    // load_messages(user_messages) {
    //     user_messages.forEach((item) => {
    //         if (item.type === 'sent') {
    //             this.messages__add_sent(item.message)
    //         }
    //         if (item.type === 'received') {
    //             this.messages__add_received(item.message)
    //         }
    //     });
    //     return this
    // }
    //
    // set_user_messages(user_messages) {
    //     //this.data_chat_bot.user_messages = user_messages            // set data_chat_bot.user_messages value
    //     this.reset_user_messages()
    //     this.load_messages(user_messages)                           // reload messages in UI
    //     return this
    // }
    //
    // reset_user_messages() {
    //     this.data_chat_bot.user_messages = []
    //     webc_chat_bot.div_chat_messages.innerHTML =''
    //     return this
    // }
    // store_message(message, type) {
    //     this.data_chat_bot.add_user_message(message, type)
    //     return this
    // }
    //
    // messages__add(template, message) {
    //     const formatted_message = message.replace(/\n/g, '<br>');
    //     const new_message = template.content.cloneNode(true)
    //     new_message.querySelector('.message').innerHTML = formatted_message;
    //     const document_fragment = this.div_chat_messages.appendChild(new_message);
    //     this.div_chat_messages.scrollTop = this.div_chat_messages.scrollHeight;      // todo: add check if we should do this
    //     return document_fragment
    // }
    //
    // messages__add_sent (message) {
    //     const template = this.target_element.querySelector('#template_sent') //.content.cloneNode(true);
    //     this.messages__add(template, message)
    //     this.data_chat_bot.add_user_message(message, 'sent')
    // }
    //
    // messages__add_received (message) {
    //     const template = this.target_element.querySelector('#template_received') //.content.cloneNode(true);
    //     this.messages__add(template, message)
    //     this.data_chat_bot.add_user_message(message, 'received')
    // }
}

WebC__Chat_Bot.define()