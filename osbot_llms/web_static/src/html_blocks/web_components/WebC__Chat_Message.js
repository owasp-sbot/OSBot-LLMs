import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";


export default class WebC__Chat_Message extends Web_Component {

    constructor() {
        super();
        this.message_raw  = ''
        this.message_html = ''
        this.type         = ''
    }
    connectedCallback() {
        this.build()
    }

    build() {
        //const script_markdown= '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>'
        this.type = this.attributes.type?.value
        this.add_css_rules (this.css_messages())
        this.set_inner_html(this.html())
        this.style.display = 'inherit'              // need to add this so that align-self works ('contents' seems a better value, but 'inherit'
    }

    css_messages() { return {   ".message"      : { "margin-bottom"   : "10px"             ,
                                                    "max-width"       : "80%"              ,
                                                    "padding"         : "10px"             },
                                ".received"     : { "background-color": "#f2f2f2"           ,
                                                    "align-self"      : "flex-start"        ,
                                                    "border-radius"   : "10px 10px 10px 0px"},
                                ".sent"         : { "background-color": "#724ae8"           ,
                                                    "align-self"      : "flex-end"          ,
                                                    "color"           : "#fff"              ,
                                                    "border-radius"   : "10px 10px 0 10px"  },
                                ".spinner"      : { "border"          : "4px solid #f3f3f3" , /* Light grey */
                                                    "border-top"      : "4px solid #3498db" , /* Blue */
                                                    "border-radius"   : "50%"               ,
                                                    "width"           : "15px"              ,
                                                    "height"          : "15px"              }}
    }

    append(message) {
        this.message_raw += message
        this.show_message()
        return this
    }

    create_message_html(message) {
        if (window.marked === undefined) {
            return message.replace(/\n/g, '<br>');
        }
        else {
            return marked.marked(message)
        }

    }

    html() {
        const div_class = `message ${this.type}`
        const div_message = new Tag({tag: 'div', class: div_class})
        const div_slot    = new Tag({tag: 'slot' })
        //const div_spinner = new Tag({tag: 'div', class:'spinner'})

        div_message.add(div_slot)
        return div_message.html()
        //return div_message.html() + div_spinner.html()
    }

    images(images){
        if (images && images.length > 0 ) {
            const hr = document.createElement('hr');
            this.appendChild(hr)
            for (let index in images) {
                const image_url = images[index]
                //todo refactor to creating with Tag (and into utils class)
                const img = document.createElement('img');
                img.src = image_url
                img.style="width:auto; height:auto; margin:10px;max-width:350px;max-height:350px"
                this.appendChild(img)
            }
        }
    }
    //todo see if this assigment is better done using a property
    message(value) {
        if (value){
            this.message_raw = value
            this.show_message()
        }
        return this.innerHTML
    }

    show_message(){
        this.message_html = this.create_message_html(this.message_raw)
        this.innerHTML    = this.message_html
    }

    hide_spinner() {
        const dom_spinner = this.shadowRoot.querySelector('.spinner')
        if (dom_spinner) {
            dom_spinner.remove()
            return true }
        return false
    }

    show_spinner() {
        const div_spinner = new Tag({tag: 'div', class:'spinner'})
        const dom_spinner = div_spinner.dom_create()

        this.shadow_root_append(dom_spinner)

        const keyframes = [ { transform: 'rotate(0deg)' },    // Start at 0 degrees
                            { transform: 'rotate(360deg)' }];   // Rotate 360 degrees

        const options   = { duration    : 1500      ,   // Duration in milliseconds
                            iterations  : Infinity  ,   // Repeat the animation indefinitely
                            easing      : 'linear'  };  // Use a linear pacing function

        dom_spinner.animate(keyframes, options);     // Apply the animation to the element
        return dom_spinner
    }

}

WebC__Chat_Message.define()