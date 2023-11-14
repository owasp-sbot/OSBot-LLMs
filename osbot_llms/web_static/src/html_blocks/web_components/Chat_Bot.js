import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";
import Tag from "../js/Tag.js";

export default class Chat_Bot extends Web_Component {
    constructor() {
        super();
    }
    // build() {
    //     const div_chat_bot        = new Div_Chat_Bot()
    //     this.shadowRoot.innerHTML = div_chat_bot.html()
    //     const css_rules = this.get_css_rules()
    //     this.add_css_rules(css_rules)
    // }

    create_target_div({right="60px" , width="30%", top="60px", bottom="120px"}={}) {
        const css_rules = { ".right-div": {
                                border:             "3px solid blue",
                                bottom:             bottom,
                                overflow:           "auto",
                                position:           "fixed",
                                right:              right,
                                top:                top,
                                width:              width,
                                "z-index":          "1000",
                                backgroundColor:    "white"
                            },
                            ".container-full-height": {
                                display:            "flex",
                                "flex-direction":   "column",
                                height:             "100%",
                                padding:            "0"
                            },
                            ".flex-row": {
                                flex:               "1",
                                display:            "flex"
                            },
                            ".flex-col": {
                                flex:               "1",
                                display:            "flex",
                                padding:            "0"
                            },
                            ".content-center": {
                                border:             "3px solid red",
                                "flex-grow":        "1",
                                display:            "flex",
                                "justify-content":  "center",
                                "align-items":      "center"
                            }
                        };


        this.add_css_rules(css_rules)
        this.set_inner_html('<div id="html_block" class="right-div">...content..</div>')
    }

    build() {
        //this.dom_chat_bot.build()
        const div_container = new Div({id: 'container_div', class: 'container-full-height'})

        const container_html = div_container.html()
        const target_div = this.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = container_html

//         const html_code =
// `<div class="chatbot-ui">
//   <div class="chat-header">Chatbot</div>
//   <div class="chat-messages">
//     <div class="message received">Hi there 👋<br>How can I help you today?</div>
//     <div class="message sent">!this is a message from the test</div>
//     <div class="message received">this is a reply</div>
//     <div class="message sent">...another user question</div>
//     <div class="message received">this is a reply asa alsdj ladj lkajsdlkasd klas sdlfhsd gfhsau </div>
//     <div class="message sent">...another user question asldkjalsdkj alskdj aslkd alskdj as</div>
//
//   </div>
//   <div class="chat-input">
//     <input type="text" placeholder="Enter a message..." />
//   </div>
// </div>`
        const html_code = this.html_code()
        const css_rules = { "*"             : { "font-family": "Verdana"},
                            ".chatbot-ui"   : { display: "flex",
                                                "flex-direction": "column",
                                                "max-width": "100%",
                                                height: "100%", // Adjust to the height of the content-center div
                                                "background-color": "#fff",
                                                "border-radius": "10px",
                                                "box-shadow": "0 0 10px rgba(0,0,0,0.1)",
                                                overflow: "hidden"},
                            ".chat-header"  : { "background-color": "#5a4ad1",
                                                color: "#fff",
                                                padding: "10px",
                                                "text-align": "center",
                                                "font-size": "1.2em" },
                            ".chat-messages": { display: "flex",
                                                "flex-direction": "column",
                                                "flex-grow": "1",
                                                padding: "10px",
                                                "overflow-y": "auto" },
                            ".message"      : { "margin-bottom": "10px",
                                                padding: "10px",
                                                "border-radius": "20px",
                                                "max-width": "80%"},
                            ".message.received": { "background-color": "#e5e5ea",
                                                   "align-self": "flex-start" },
                            ".message.sent" : { "background-color": "#4b2c74",
                                                "align-self": "flex-end",
                                                color: "#fff"   },
                            ".chat-input"   : { padding: "10px",
                                                background: "#fff",
                                                "box-shadow": "0 -2px 10px rgba(0,0,0,0.1)" },
                            ".chat-input input": {  width: "90%",
                                                    padding: "10px",
                                                    "border-radius": "20px",
                                                    border: "1px solid #ccc",
                                                    outline: "currentcolor"
        }};

        this.add_css_rules(css_rules)
        //const  content_center = this.dom_chat_bot.shadowRoot.querySelector('.content-center')
        target_div.innerHTML= html_code
    }

    html_code() {
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
        //div_chat_header.html_config.new_line_before_elements = false
        //div_chat_header.html_config.indent_before_last_tag   = false
        return div_chatbot_ui.html()
    }
}