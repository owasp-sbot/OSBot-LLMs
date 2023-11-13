import Div  from '../js/Div.js';
import Text from '../js/Text.js';

export default class Simple_Web_Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.html()
        this.set_css()
    }

    root_element(){
        const div = new Div({class:"content"})
        const text = div.add_text(this.text_content()).just_text()
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

    css_properties() {
        const margin = '20px'
        return {
            ':host': {
                left            : '50%',
                top             : margin,
                right           : margin,
                bottom          : margin,
                backgroundColor : 'white',
                border          : '2px solid rgb(0, 0, 0)',
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
        const styleSheet = new CSSStyleSheet();
        const cssProperties = this.css_properties();

        Object.entries(cssProperties).forEach(([css_selector, css_properties]) => {             // Iterate over each key (selector) in cssProperties
            const css_init          = `${css_selector} {}`;                                     // note: it looks like at the moment there isn't another way to create an empty CSSStyleRule and populate it
            const rules_length      = styleSheet.cssRules.length                                // get size of css rules
            const insert_position   = styleSheet.insertRule(css_init, rules_length);            // so that we can create a new one at the end
            const cssRule           = styleSheet.cssRules[insert_position];                     // get a reference to the one we added
            this.populate_rule(cssRule, css_properties);                                        // populate new css rule with provided css properties
        });

        this.shadowRoot.adoptedStyleSheets = [styleSheet];                                      // add new style sheet to adopted stylesheets for the shadow root
    }


    populate_rule(css_rule, css_properties) {
        for (let prop_name in css_properties) {
            const css_prop_name = prop_name.replace(/([A-Z])/g, '-$1').toLowerCase();           // Convert camelCase to kebab-case
            const css_prop_value = css_properties[prop_name]                                    // get css prop value
            css_rule.style.setProperty(css_prop_name, css_prop_value);                          // set property in css_rule
        }
    }
}


