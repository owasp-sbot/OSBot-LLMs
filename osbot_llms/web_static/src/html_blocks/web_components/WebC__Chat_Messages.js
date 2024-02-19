import Web_Component      from "./Web_Component.js";
import WebC__Chat_Message from "./WebC__Chat_Message.js";


export default class WebC__Chat_Messages extends Web_Component {

    constructor() {
        super();
        this.dom_spinner = null
    }

    add_event_hooks() {
        //console.log("configuring event hooks in WebC__Chat_Messages")

        var current_message = null
        window.addEventListener('streamStart', (e)=>{
            current_message = this.add_message_received('')
        });

        window.addEventListener('streamComplete', (e)=>{
            //console.log('>>>>> streamComplete:")', e)
        });
        window.addEventListener('streamData', (e)=>{
            if (this.dom_spinner) {
                this.dom_spinner.remove();
                this.dom_spinner = null }
            const chunk = e.detail
            current_message.append(chunk)
        });
    }

    connectedCallback() {
        this.build()
        this.add_event_hooks()
    }

    build() {
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

    add_message(message, type, images) {
        const new_message =  WebC__Chat_Message.create({type:type})
        this.appendChild(new_message)
        new_message.message(message)
        new_message.images(images)
        return new_message
    }

    add_message_sent    (message) {
        const message_sent = this.add_message(message.user_prompt, 'sent' , message.images  )
        this.dom_spinner = message_sent.show_spinner()
        const event = new CustomEvent('messageSent', {
            bubbles : true    ,                         // allows the event to bubble up through the DOM
            composed: true    ,                         // allows the event to cross shadow DOM boundaries
            detail  : { message } });
        this.dispatchEvent(event);

        return message_sent
    }

    add_message_initial(message) {
        return this.add_message(message, 'initial')
    }

    add_message_received(message) {
        return this.add_message(message, 'received')
    }


    on_message_sent    (callback) {
        // how to create a custom event
    }
    on_message_received(message) {

    }  // method to be overwritten by Classes that extend this one

    messages () {
        return this.childNodes
    }

    messages_div () {
        return this.query_selector('.messages')

    }
    messages_div_scroll_to_end() {
        const messages_div = this.messages_div()
        messages_div.scrollTop = messages_div.scrollHeight
    }
}

WebC__Chat_Messages.define()