import Web_Component      from "./Web_Component.js";
import Tag                from "../js/Tag.js";

export default class WebC__Chat_Input extends Web_Component {

    constructor() {
        super();
    }

    // properties
    get input() {
        return this.query_selector('input')
    }

    // methods

    add_event_hooks() {
        this.input.addEventListener('keydown',(e) => this.on_input_keydown(e))
    }

    connectedCallback() {
        this.build()
        this.add_event_hooks()
    }

    build() {
        this.add_css_rules (this.css_rules())
        this.set_inner_html(this.html     ())
    }

    css_rules() { return { "*"                : { "font-family"    : "Verdana" },
                           ".chat-input"      : { padding: "10px",
                                                  background: "#fff",
                                                  "box-shadow": "0 -2px 10px rgba(0,0,0,0.1)" },
                           ".chat-input input": { width: "90%",
                                                  padding: "10px",
                                                  "border-radius": "20px",
                                                  border: "1px solid #ccc",
                                                }};
    }

    html() {
        const tag = new Tag()
        const div_chat_input     = tag.clone({tag:'div'   , class:'chat-input'                                        })
        const input_chat_input   = tag.clone({tag:'input' , attributes:{type:'text', placeholder:'Enter a message...'}})

        div_chat_input.add(input_chat_input)
        input_chat_input.html_config.include_end_tag  = false
        return div_chat_input.html()
    }

    on_input_keydown(e) {
        // todo: remove e_.key once test event trigger is working
        if(e.key === "Enter" || e._key === "Enter") {         //  todo: add this when we have support for textarea as the bot input:    && !e.shiftKey
            this.event_dispatch('new_input_message', this.input.value)
            this.input.value  =''
        }
    }

    event_dispatch(event_name, detail) {
        const event_data = {
            bubbles : true      ,                         // allows the event to bubble up through the DOM
            composed: true      ,                         // allows the event to cross shadow DOM boundaries
            detail  : detail
        }
        this.dispatchEvent(new CustomEvent(event_name, event_data))
    }

}

WebC__Chat_Input.define()