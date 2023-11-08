export default class Tag {
    constructor({tag: tag = 'tag', id=null}={}) {
        this.styles         = this.default_styles();              // set default styles
        this.html_config    = this.default_html_config();         // set default html config
        this.element_dom    = null
        this.element_parent = null
        this.parent_dom     = null
        this.tag            = tag
        this.id             = id || this.generate_random_id();    // ensure there is alwasys an id
        this.elements       = [];
    }

    add(element) {
        this.add_element(element)
        return this
    }

    add_element(element) {
        element.element_parent = this
        this.elements.push(element)
        return true
    }

    default_html_config() { return { new_line_before_elements: true,
                                     new_line_after_final_tag: true }}

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

    dom() {
        return this.element_dom
    }

    // dom_add_to_selector(selector) {
    //     const targetElements = document.querySelectorAll(selector);
    //
    //     targetElements.forEach(element => {
    //         this.dom_add_to_element(element)
    //     });
    //     return this;
    // }

    dom_add() {
        return this.dom_add_to_element(document.body)
    }

    dom_add_to_id(tag_id){
        const element = document.getElementById(tag_id)
        return this.dom_add_to_element(element)
    }

    dom_add_to_element(dom_element) {
        if (dom_element && this.dom() === null) {
            dom_element.insertAdjacentHTML('beforeend', this.html());
            this.element_dom = document.getElementById(this.id)
            this.parent_dom  = dom_element
            return true
        }
        return false
    }

    dom_set_style(property, value) {
        if (this.dom()) {
            this.dom().style[property] = value;
        }
    }

    dom_parent() {
        return this.parent_dom
    }

    dom_remove() {
        const dom_element = this.dom()
        if (dom_element) {
            dom_element.remove()
            this.element_dom = null
            return this.dom() === null
        }
        return false

    }

    generate_random_id() {
        const random_part = Math.random().toString(36).substring(2, 7); // Generate a random string.
        return `${this.tag.toLowerCase()}_${random_part}`;
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
        const indent = ' '.repeat(depth * 4)
        let html = ''
        html = indent + `<${this.tag} id="${this.id}"`;
        if (styleString.length > 0) {
            html += ` style="${styleString}"`;
        }
        if (this.html_config.new_line_before_elements) {
            html += '>\n' }
        else {
            html += '>'   }

        html += this.inner_html(depth)
        html += indent + `</${this.tag}>`;
        if (this.html_config.new_line_after_final_tag) {
            html += '\n' }
        return html;
    }

    inner_html(depth=0) {
        var html = ''
        for (const index in this.elements) {
            const element = this.elements[index]
            html += element.html(depth+1)
        }
        return html
    }

    parent() {
        return this.element_parent
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