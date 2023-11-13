import Div  from '../js/Div.js';
import Web_Component from "./Web_Component.js";

export default class Simple_Web_Component extends Web_Component {
    constructor() {
        super();
        this.shadowRoot.innerHTML = this.html()
        this.set_css()
    }

    root_element(){
        const div = new Div({class:"content"})
        div.add_text(this.text_content()).just_text()
        div.html_config.include_id = false
        div.html_config.new_line_before_elements = false
        div.html_config.new_line_after_final_tag = false
        return div
    }
    html() {
        return this.root_element().html()
    }
    text_content() {
        return 'Hello, this is my custom component!'
    }

    css_rules() {
        const margin = '20px'
        return {
            ':host': {
                left            : '50%',
                top             : margin,
                right           : margin,
                bottom          : margin,
                backgroundColor : 'white',
                border          : '10px solid rgb(0, 0, 0)',
                padding         : '10px',
                fontFamily      : 'Arial, sans-serif',
                zIndex          : 10,
                position        : 'absolute'
            },
            '.content': {
                color: 'blue'
            }
        };
    }

    set_css() {
        this.add_css_rules(this.css_rules())
    }

}


