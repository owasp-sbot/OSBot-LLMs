import Web_Component      from "./Web_Component.js";
import WebC__Chat_Message from "./WebC__Chat_Message.js";


export default class WebC__Chat_Messages extends Web_Component {

    constructor() {
        super();
    }

    connectedCallback() {
        this.build()
    }

    build() {
        const type = this.attributes.type?.value
        this.add_css_rules(this.css_rules())
        const html = `<div class="messages"><slot></slot></div>`
        this.set_inner_html(html)
    }

    css_rules() { return { "*"         : { "font-family"    : "Verdana" },
                           ".messages" : { "display"        : "flex"    ,
                                           "flex-direction" : "column"  ,
                                           "overflow-y"     : "auto"    ,
                                           "padding"        : "10px"    }}
    }

    add_message(message, type) {
        const new_message =  WebC__Chat_Message.create({type:type})
        this.appendChild(new_message)
        new_message.message(message)
        return new_message
    }

    add_message_sent    (message) { return this.add_message(message, 'sent'   ) }
    add_message_received(message) { return this.add_message(message, 'received') }

    messages () {
        return this.childNodes
    }
}

WebC__Chat_Messages.define()