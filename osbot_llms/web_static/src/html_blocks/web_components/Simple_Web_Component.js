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
        return {
            leftBuffer      : '50%',
            margin          : '40px',
            backgroundColor : 'white',
            borderColor     : 'black',
            padding         : '10px',
            fontFamily      : 'Arial, sans-serif',
            zIndex          : 10,
            position        : 'absolute',
            contentColor    : 'blue',
        };
    }
    set_css() {
        const styleSheet = new CSSStyleSheet();
        const cssProperties = this.css_properties()
        // Use the properties to construct the CSS string
        styleSheet.replaceSync(`
            :host {
                --left-buffer: ${cssProperties.leftBuffer};
                --margin: ${cssProperties.margin};
                left: calc(var(--left-buffer) + var(--margin));
                right: var(--margin);
                top: var(--margin);
                bottom: var(--margin);
                background-color: ${cssProperties.backgroundColor};
                display: block;
                border: 1px solid ${cssProperties.borderColor};
                padding: ${cssProperties.padding};
                font-family: ${cssProperties.fontFamily};
                z-index: ${cssProperties.zIndex};
                position: ${cssProperties.position};
            }
            .content {                
                color: ${cssProperties.contentColor};                
            }
        `);

        this.shadowRoot.adoptedStyleSheets = [styleSheet];
    }
}


