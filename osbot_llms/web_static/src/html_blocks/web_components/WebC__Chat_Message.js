import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";


export default class WebC__Chat_Message extends Web_Component {

    constructor() {
        super();
    }
    connectedCallback() {
        this.build()
        //console.log(this.attributes.type?.value)
    }

    build() {
        const type = this.attributes.type?.value
        this.add_css_rules(this.css_messages())
        //const html = `<div class="messages"><div class="message ${type}"><slot></slot></div></div>`
        const html = `<div class="message ${type}"><slot></slot></div>`
        this.set_inner_html(html)
    }

    css_messages() { return {   "*"         : { "font-family"     : "Verdana"         },
                                                //"padding"         : "10px"            },
                                ".messages" : { "display"         : "flex"            ,
                                                "flex-direction"  : "column"          ,
                                                "overflow-y"      : "auto"            ,
                                                "padding"         : "10px"            },
                                ".message"  : { "margin-bottom"   : "10px"            ,
                                                "max-width"       : "80%"             ,
                                                "padding"         : "10px"            },
                                ".received" : { "background-color": "#f2f2f2"         ,
                                                "align-self"      : "flex-start"      ,
                                                "border-radius"   : "10px 10px 10px 0px"},
                                ".sent"     : { "background-color": "#724ae8"         ,
                                                "align-self"      : "flex-end"        ,
                                                "color"           : "#fff"            ,
                                                "border-radius"   : "10px 10px 0 10px"}}
    }
}

WebC__Chat_Message.define()