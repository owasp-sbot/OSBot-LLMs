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
        const margin = '30px'
        return {
            host: {
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
            content: {
                color: 'blue'
            }
        };
    }

    set_css() {
        const styleSheet = new CSSStyleSheet();
        const cssProperties = this.css_properties();

        const hostRule = this.objectToCssRule(cssProperties.host, ':host');
        styleSheet.insertRule(hostRule, styleSheet.cssRules.length);

        const contentRule = this.objectToCssRule(cssProperties.content, '.content');
        styleSheet.insertRule(contentRule, styleSheet.cssRules.length);

        this.shadowRoot.adoptedStyleSheets = [styleSheet];
    }

    objectToCssRule(properties, selector) {
        let rule = `${selector} {`;
        for (let prop in properties) {
            let cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase(); // Convert camelCase to kebab-case
            rule += ` ${cssProp}: ${properties[prop]};`;
        }
        rule += ' }';
        return rule;
    }
}


