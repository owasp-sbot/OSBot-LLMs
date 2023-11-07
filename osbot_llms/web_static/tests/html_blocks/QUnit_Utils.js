export class Div {
    constructor() {
        this.styles     = this.default_styles()
        this.id         = null
        this.tag_name   = 'Div'
    }

    add_to(selector) {
        const targetElements = document.querySelectorAll(selector);
        targetElements.forEach(element => {
            this.add_to_element(element)
        });
        return this;
    }
    add_to_element(element) {
        element.insertAdjacentHTML('beforeend', this.html());
    }

    default_styles() { return { background_color: null,
                                border          : null,
                                bottom          : null,
                                left            : null,
                                margin          : null,
                                overflow        : null,
                                padding         : null,
                                position        : null,
                                right           : null,
                                top             : null,
                                width           : null,
                                z_index         : null}}
    inner_html() { return '' }

    html() {
        let html = `<${this.tag_name}`;
        let styleString = '';

        // Check if `this.style` exists and has properties
        if (this.styles && Object.keys(this.styles).length) {
            // Construct the style attribute value
            console.log(this.styles)
            for (const key in this.styles) {
                if (this.styles.hasOwnProperty(key) && this.styles[key]) {
                    const styleKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();      // Convert camelCase to kebab-case for CSS properties
                    styleString += `${styleKey}: ${this.styles[key]}; `;
                }
            }

            // Trim the last space and append the style attribute to the HTML string
            styleString = styleString.trim();
            if (styleString.length > 0) {
                html += ` style="${styleString}"`;
            }
        }

        // Add other attributes here if needed...

        // Close the opening tag, insert inner HTML, and close the tag
        html += `>${this.inner_html()}</${this.tag_name}>`;
        return html;
    }

    set_style(key, value) {
        this.styles[key] = value
        return this
    }

    set_styles(key_values) {
        for (var key in key_values) {
            const value = key_values[key]
            this.set_style(key,value)
        }
        return this
    }
}

export class QUnit_Utils {

    constructor() {
        // Initialization code here
        //console.log('QUnit_Utils instance created');
    }
    ping() {
        return 'pong'
    }

    create_div() {
        // Create the div with the id 'html_block' and class 'right-div'
        var $div = $('<div>', { id: 'html_block', class: 'right-div' });
        var margin = 30
        var top    = margin
        var bottom = margin
        var left   = margin
        var right  = margin
        // Apply the CSS styles to the div
        var css_attrs = {
            'background-color': 'white',
            'border': '3px solid blue',
            'bottom': `${bottom}px`,
            'overflow': 'auto',
            'padding': '0',
            'position': 'fixed',
            //'left'    : `${left}px`,
            'right'   : `${right}px`,
            'top': `${top}px`,
             'width': '30%',
            'z-index': '1000'
        }
        $div.css(css_attrs);

        // Append the div to the body of the document
        $('body').append($div);
        return $div
    }
}