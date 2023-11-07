export default class Div {
    constructor(id=null) {
        this.styles     = this.default_styles()
        this.tag_name   = 'div'
        this.id         = id || this.generate_random_id();
        this.elements   = []
    }

    generate_random_id() {
        const random_part = Math.random().toString(36).substring(2, 7); // Generate a random string.
        return `${this.tag_name.toLowerCase()}_${random_part}`;
    }

    add_element(element) {
        this.elements.push(element)
    }

    add_to(selector) {
        const targetElements = document.querySelectorAll(selector);
        targetElements.forEach(element => {
            this.add_to_dom_element(element)
        });
        return this;
    }
    add_to_dom_element(dom_element) {
        dom_element.insertAdjacentHTML('beforeend', this.html());
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
    inner_html(depth) {
        var html = ''
        for (const index in this.elements) {
            const element = this.elements[index]
            html += element.html(depth+1)
        }
        return html
    }

    html(depth=0) {
        let styleString = '';

        // Check if `this.style` exists and has properties
        if (this.styles && Object.keys(this.styles).length) {
            // Construct the style attribute value
            for (const key in this.styles) {
                if (this.styles.hasOwnProperty(key) && this.styles[key]) {
                    const styleKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();      // Convert camelCase to kebab-case for CSS properties
                    styleString += `${styleKey}: ${this.styles[key]}; `;
                }
            }

            // Trim the last space and append the style attribute to the HTML string
            styleString = styleString.trim();
        }

        // todo: Add other attributes

        // Close the opening tag, insert inner HTML, and close the tag
        //html += `>${this.inner_html()}</${this.tag_name}>`;
        const indent = ' '.repeat(depth * 4)
        let html = ''
        html = indent + `<${this.tag_name} id="${this.id}"`;
        if (styleString.length > 0) {
            html += ` style="${styleString}"`;
        }
        html += '>\n'
        html += this.inner_html(depth)
        //html += '\n'
        html += indent + `</${this.tag_name}>`;
        html += '\n'
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

export function div_create_box(id=null, margin=40, border='10px solid blue')  {
    const div = new Div(id)
    div.set_styles({'top'    : `${margin}px`   ,
                    'bottom' : `${margin}px`   ,
                    'right'  : `${margin}px`   ,
                    'left'   : `${margin}px`   ,
                    'border' : border          ,
                    'position': 'absolute'     })

    //div.add_to_dom_element(document.body);
    return div
    //console.log(document.body.innerHTML)
}