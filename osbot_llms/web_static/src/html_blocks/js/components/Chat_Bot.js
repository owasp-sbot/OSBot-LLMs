import WebC__Chat_Bot   from '../../web_components/WebC__Chat_Bot.js'
export default class Chat_Bot {
    constructor() {
        this.webc_name = 'chat-bot'
        this.webc_class = WebC__Chat_Bot
        this.webc_defined  = false
    }

    add_to_page(...kwrags) {
        const element_chat_bot = this.create_element_in_document_body()
        return  element_chat_bot.build(...kwrags)
    }

    create_element_in_document_body() {
        const new_element = document.createElement(this.webc_name)
        document.body.appendChild(new_element);
        return new_element
    }
    define() {
        if (this.webc_defined === false){
            customElements.define(this.webc_name, this.webc_class);
            this.webc_defined = true
            return true
        }
        return false
    }


}