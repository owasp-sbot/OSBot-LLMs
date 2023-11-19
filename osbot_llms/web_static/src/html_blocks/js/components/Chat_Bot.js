import WebC__Chat_Bot   from '../../web_components/WebC__Chat_Bot.js'
import WebC__Target_Div from '../../web_components/WebC__Target_Div.js'

export default class Chat_Bot {
    constructor() {
        this.webc_name = 'chat-bot'
        this.webc_class = WebC__Chat_Bot
    }

    // create_element() {
    //     const webc_chat_bot = WebC__Chat_Bot.create()
    //     return webc_chat_bot
    // }
    create_and_add_to_body(...kwargs) {
        const target_div   = WebC__Target_Div.add_to_body().build(...kwargs)
        return target_div.append_child(WebC__Chat_Bot)
        //return webc_chat_bot
        //const element_chat_bot = this.create_element_in_document_body()
        //return  element_chat_bot.build(...kwrags)
    }

    create_element_in_document_body(...kwargs) {
        const new_element = WebC__Chat_Bot.create()
        // const new_element = document.createElement(this.webc_name)
        document.body.appendChild(new_element);
        return new_element
    }

}