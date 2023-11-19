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

    create_in_document_body(...kwargs) {
        const webc_chat_bot = WebC__Chat_Bot.create(...kwargs)
        // const new_element = document.createElement(this.webc_name)
        document.body.appendChild(webc_chat_bot);
        return webc_chat_bot
    }

    create_in_element(element, ...kwargs) {
        const webc_chat_bot = WebC__Chat_Bot.create(...kwargs)
        element.innerHTML =''
        webc_chat_bot.style.display = 'contents'    // allow display to propagete via the main webc_chat_bot object
        element.appendChild(webc_chat_bot)
        return webc_chat_bot
    }

}