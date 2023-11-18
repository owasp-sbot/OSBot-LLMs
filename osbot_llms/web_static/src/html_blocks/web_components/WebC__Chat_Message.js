import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";


export default class WebC__Chat_Message extends Web_Component {

    constructor() {
        super();
    }
    connectedCallback() {
        this.build()
    }

    build() {
        const type = this.attributes.type?.value
        this.add_css_rules(this.css_messages())
        const html = `<div class="message ${type}"><slot></slot></div>`
        this.set_inner_html(html)
        this.style.display = 'inherit'              // need to add this so that align-self works ('contents' seems a better value, but 'inherit'
    }

    css_messages() { return {   ".message"  : { "margin-bottom"   : "10px"            ,
                                                "max-width"       : "80%"              ,
                                                "padding"         : "10px"            ,
        "display": "flex"
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
        this.innerHTML += message
        return this
    }
    message() {
        return this.innerHTML
    }
}

WebC__Chat_Message.define()