import Div_Chat_Bot from '../js/components/Div_Chat_Bot.js';
import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";

export default class Chat_Bot extends Web_Component {
    constructor() {
        super();
    }
    build() {
        const div_chat_bot        = new Div_Chat_Bot()
        this.shadowRoot.innerHTML = div_chat_bot.html()
        const css_rules = this.get_css_rules()
        this.add_css_rules(css_rules)
    }

    get_css_rules() {
        const chatbot_header_background = 'red' // "#724ae8"

        const css_rules = {
            "*": {
                margin: "0",
                padding: "0",
                "box-sizing": "border-box",
                "font-family": 'sans-serif'
            },
            // body: {
            //     background: "#E3F2FD"
            // },
            ".chatbot-toggler": {
                position: "fixed",
                bottom: "30px",
                right: "35px",
                outline: "none",
                border: "none",
                height: "50px",
                width: "50px",
                display: "flex",
                cursor: "pointer",
                "align-items": "center",
                "justify-content": "center",
                "border-radius": "50%",
                background: "#724ae8",
                transition: "all 0.2s ease"
            },
            "div.show-chatbot .chatbot-toggler": {
                transform: "rotate(90deg)"
            },
            ".chatbot-toggler span": {
                color: "#fff",
                position: "absolute"
            },
            ".chatbot-toggler span:last-child, div.show-chatbot .chatbot-toggler span:first-child": {
                opacity: "0"
            },
            "div.show-chatbot .chatbot-toggler span:last-child": {
                opacity: "1"
            },
            ".chatbot": {
                top: "0px",
                //position: "fixed",
                left: "0px",
                //right: "0px",
                //bottom: "0px",
                //width: "100px",
                background: "#fff",
                "border-radius": "15px",
                overflow: "hidden",
                opacity: "0",
                "pointer-events": "none",
                transform: "scale(0.5)",
                "transform-origin": "bottom right",
                "box-shadow": "0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5)",
                transition: "all 0.1s ease"
            },
            "div.show-chatbot .chatbot": {
                opacity: "1",
                "pointer-events": "auto",
                transform: "scale(1)"
            },
            ".chatbot header": {
                padding: "16px 0",
                position: "relative",
                "text-align": "center",
                color: "#fff",
                //background: "#724ae8",
                //background: "red",
                background: chatbot_header_background,
                "box-shadow": "0 2px 10px rgba(0,0,0,0.1)"
            },
            ".chatbot header span": {
                position: "absolute",
                right: "15px",
                top: "50%",
                display: "none",
                cursor: "pointer",
                transform: "translateY(-50%)"
            },
            "header h2": {
                "font-size": "1.4rem"
            },
            ".chatbot .chatbox": {
                "overflow-y": "auto",
                height: "510px",
                padding: "30px 20px 100px"
            },
            ".chatbot :where(.chatbox, textarea)::-webkit-scrollbar": {
                width: "6px"
            },
            ".chatbot :where(.chatbox, textarea)::-webkit-scrollbar-track": {
                background: "#fff",
                "border-radius": "25px"
            },
            ".chatbot :where(.chatbox, textarea)::-webkit-scrollbar-thumb": {
                background: "#ccc",
                "border-radius": "25px"
            },
            ".chatbox .chat": {
                display: "flex",
                "list-style": "none"
            },
            ".chatbox .outgoing": {
                margin: "20px 0",
                "justify-content": "flex-end"
            },
            ".chatbox .incoming span": {
                width: "32px",
                height: "32px",
                color: "#fff",
                cursor: "default",
                "text-align": "center",
                "line-height": "32px",
                "align-self": "flex-end",
                background: "#724ae8",
                "border-radius": "4px",
                margin: "0 10px 7px 0"
            },
            ".chatbox .chat p": {
                "white-space": "pre-wrap",
                padding: "12px 16px",
                "border-radius": "10px 10px 0 10px",
                "max-width": "75%",
                color: "#fff",
                "font-size": "0.95rem",
                background: "#724ae8"
            },
            ".chatbox .incoming p": {
                "border-radius": "10px 10px 10px 0",
                color: "#000",
                background: "#f2f2f2"
            },
            ".chatbox .chat p.error": {
                color: "#721c24",
                background: "#f8d7da"
            },
            ".chatbot .chat-input": {
                display: "flex",
                gap: "5px",
                position: "absolute",
                bottom: "0",
                width: "100%",
                background: "#fff",
                padding: "3px 20px",
                "border-top": "1px solid #ddd"
            },
            ".chat-input textarea": {
                height: "55px",
                width: "100%",
                border: "none",
                outline: "none",
                resize: "none",
                "max-height": "180px",
                padding: "15px 15px 15px 0",
                "font-size": "0.95rem"
            },
            ".chat-input span": {
                "align-self": "flex-end",
                color: "#724ae8",
                cursor: "pointer",
                height: "55px",
                display: "flex",
                "align-items": "center",
                visibility: "hidden",
                "font-size": "1.35rem"
            },
            ".chat-input textarea:valid ~ span": {
                visibility: "visible"
            }
        };


        return css_rules
    }

    add_div_box({id=null, top="10px", bottom="10px", right="10px", left="10px", border="2px black solid"} = {}) {
        const div = new Div({id:id})
        div.set_styles({'top'             : `${top}`   ,
                        'bottom'          : `${bottom}`,
                        'right'           : `${right}` ,
                        'left'            : `${left}`  ,
                        'border'          : border     ,
                        'position'        : 'absolute' ,
                        'background-color': 'gray'    })
        div.dom_add()
        return div
    }
    // async load_css_from_url()
    // {
    //     //const css_link = '../../../src/chatbot/style.css';
    //     const css_link = '../../../tests/html_blocks/js/components/div_chat_bot.style.css'
    //     fetch(css_link)
    //         .then((response)=>response.text())
    //         .then((css_data)=>{
    //             const style = document.createElement('style');
    //             style.textContent = css_data;
    //             this.shadowRoot.appendChild(style);
    //         })
    // }
}