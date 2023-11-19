import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";


export default class WebC__Chat_Message extends Web_Component {

    constructor() {
        super();
        this.message_raw  = ''
        this.message_html = ''
    }
    connectedCallback() {
        this.build()
    }

    build() {
        //const script_markdown= '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>'
        const type = this.attributes.type?.value
        this.add_css_rules(this.css_messages())
        const div_html = `<div class="message ${type}"><slot></slot></div>`
        this.set_inner_html(div_html)
        this.style.display = 'inherit'              // need to add this so that align-self works ('contents' seems a better value, but 'inherit'
    }

    css_messages() { return {   ".message"  : { "margin-bottom"   : "10px"            ,
                                                "max-width"       : "80%"              ,
                                                "padding"         : "10px"            ,

        },
                                ".received" : { "background-color": "#f2f2f2"         ,
                                                "align-self"      : "flex-start"      ,
                                                "border-radius"   : "10px 10px 10px 0px"},
                                ".sent"     : { "background-color": "#724ae8"         ,
                                                "align-self"      : "flex-end"        ,
                                                "color"           : "#fff"            ,
                                                "border-radius"   : "10px 10px 0 10px"}}
    }

    append(message) {
        this.message_raw += message
        //this.innerHTML += this.format_message(message)
        this.show_message()
        return this
    }

    // todo: add markdown support
    create_message_html(message) {
        if (window.marked === undefined) {
            return message.replace(/\n/g, '<br>');
        }
        else {
            return marked.marked(message)
        }

    }

    //todo see if this assigment is better done using a property
    message(value) {
        if (value){
            this.message_raw = value
            this.show_message()
            //this.innerHTML = this.format_message(value)
        }
        return this.innerHTML
    }

    show_message(){
        this.message_html = this.create_message_html(this.message_raw)
        this.innerHTML    = this.message_html
    }

}

WebC__Chat_Message.define()