import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";
import Tag from "../js/Tag.js";

export default class WebC__Chat_Bot extends Web_Component {
    constructor() {
        super();
    }

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
        element.innerHTML= div_chatbot_ui.html()
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
                                            outline: "currentcolor" }};}

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
        const div_with_text = new Div().add_text().just_text().parent()
        //console.log(div_with_text.html())

        const div_chatbot_ui    = tag.clone({tag:'div', class:'chatbot-ui'   })
        const div_chat_header   = tag.clone({tag:'div', class:'chat-header'  , value:'Chatbot'})
        const div_chat_messages = tag.clone({tag:'div', class:'chat-messages'})
        const div_message_1     = tag.clone({tag:'div', class:'message received', value:'Hi there 👋<br>How can I help you today?'})
        const div_message_2     = tag.clone({tag:'div', class:'message sent', value:'what is 40+2'})
        const div_message_3     = tag.clone({tag:'div', class:'message received', value:'the sum is 42'})
        const div_message_4     = tag.clone({tag:'div', class:'message sent', value:'thanks'})
        const div_message_5     = tag.clone({tag:'div', class:'message received', value:'you\'re welcome'})
        const div_chat_input    = tag.clone({tag:'div', class:'chat-input'})
        const input_chat_input  = tag.clone({tag:'input', attributes:{type:'text', placeholder:'Enter a message...'}})

        div_chatbot_ui    .add(div_chat_header  )
        div_chatbot_ui    .add(div_chat_messages)
        div_chat_messages .add([div_message_1, div_message_2, div_message_3,
                                div_message_4, div_message_5])
        div_chatbot_ui    .add(div_chat_input)
        div_chat_input.add(input_chat_input)

        div_chatbot_ui.html_config.trim_final_html_code        = true
        input_chat_input.html_config.include_end_tag           = false
        return div_chatbot_ui
    }

    div_target_div(chat_bot_id) {
        return new Div({id:chat_bot_id, class:'right-div'})
    }
}