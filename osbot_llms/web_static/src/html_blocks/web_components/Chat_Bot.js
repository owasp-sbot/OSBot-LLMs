import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";

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

    create_target_div({right="60px" , width="30%"}={}) {
    const css_rules = {     ".right-div": {
                                border:             "3px solid blue",
                                bottom:             "120px",
                                overflow:           "auto",
                                position:           "fixed",
                                right:              right,
                                top:                "60px",
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

        const html_code =
`<div class="chatbot-ui">
  <div class="chat-header">Chatbot</div>
  <div class="chat-messages">
    <div class="message received">Hi there 👋<br>How can I help you today?</div>
    <div class="message sent">!this is a message from the test</div>
    <div class="message received">this is a reply</div>
    <div class="message sent">...another user question</div>
    <div class="message received">this is a reply asa alsdj ladj lkajsdlkasd klas sdlfhsd gfhsau </div>
    <div class="message sent">...another user question asldkjalsdkj alskdj aslkd alskdj as</div>
    
  </div>
  <div class="chat-input">
    <input type="text" placeholder="Enter a message..." />
  </div>
</div>`
        const css_code =
`
* {
 font-family: 'Verdana'
}
.chatbot-ui {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  height: 100%; /* Adjust to the height of the content-center div */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.chat-header {
  background-color: #5a4ad1;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 1.2em;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 20px;
  max-width: 80%;
}

.message.received {
  background-color: #e5e5ea;
  align-self: flex-start;
}

.message.sent {
  background-color: #4b2c74;
  align-self: flex-end;
  color: #fff;
}

.chat-input {
  padding: 10px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.chat-input input {
  width: 90%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
}

`

        //const  content_center = this.dom_chat_bot.shadowRoot.querySelector('.content-center')
        target_div.innerHTML= `<style>${css_code}</style>${html_code}`
    }
}