import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";


export default class WebC__Chat_Messages extends Web_Component {

    constructor() {
        super();
    }
    connectedCallback() {
        this.build()
    }

    build() {
        const type = this.attributes.type?.value
        this.add_css_rules(this.css_messages())
        const html = `<div class="messages"><slot></slot></div>`
        this.set_inner_html(html)
    }

    css_messages() { return {   "*"         : { "font-family"     : "Verdana"         },
                                ".messages" : { "display"         : "flex"            ,
                                                "flex-direction"  : "column"          ,
                                                "overflow-y"      : "auto"            ,
                                                "padding"         : "10px"            }}
    }
}

WebC__Chat_Messages.define()