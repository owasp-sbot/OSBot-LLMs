export default class Web_Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // static properties
    static get element_name() {
        return this.name.replace    (/_/g , '-')  // Replace underscores with hyphens
                        .replace    (/--/g, '-')  // make sure we only have one hyphen
                        .toLowerCase()            // Convert to lowercase
    }

    // static methods

    static add_to_body() {
        return this.create_element_add_to_body()
    }

    static create({inner_html=null, tag=null,...attributes}={}) {
        const element = document.createElement(this.element_name);        // Create a new element using the provided tag name
        for (const [attr, value] of Object.entries(attributes)) {         // // Iterate over the attributes object and set attributes on the element
            element.setAttribute(attr, value);
        }
        if (inner_html != null) {
            element.innerHTML = inner_html;
        }
        if (tag != null) {
            element.innerHTML = tag.html();
        }

        return element;
    }

    // todo: refactor to use the create() method above (since this is adding an element to to document body which is only one of the scenarios
    static create_element() {
        //this.define();
        return document.createElement(this.element_name);
    }

    static create_element_add_to_body() {
        const element = this.create_element();
        return document.body.appendChild(element);
    }

    static define() {
        if (!customElements.get(this.element_name)) {
            customElements.define(this.element_name, this);
            return true; }
        return false;
    }

    // instance methods
    add_adopted_stylesheet(stylesheet) {
        const currentStylesheets = this.shadowRoot.adoptedStyleSheets;
        this.shadowRoot.adoptedStyleSheets = [...currentStylesheets, stylesheet];
    }

    append_child(WebC_Class, ...attributes) {
        const child_component = WebC_Class.create(...attributes)        // calls static method create from the Web Component class
        this.appendChild(child_component)                               // adds it as a child to the current WebC
        return child_component                                          // returns the instance created of WebC_Class
        // console.log(webc_chat_bot)
        // console.log(attributes)
    }
    // root_element() {
    //     return null
    // }

    // todo: refactor stylesheets to separate class
    add_css_rules(css_rules) {
        const styleSheet  = this.create_stylesheet_from_css_rules(css_rules) // add new style sheet to adopted stylesheets for the shadow root
        this.add_adopted_stylesheet(styleSheet)
        return styleSheet
    }

    all_css_rules() {
        const cssObject = {}
        for (let stylesheet of this.stylesheets()) {
            const cssRules = stylesheet.cssRules;
            for (let rule of cssRules) {
                cssObject[rule.selectorText] = rule.cssText; }}
        return cssObject
    }

    create_stylesheet_from_css_rules(css_rules) {
        const styleSheet = new CSSStyleSheet();

        Object.entries(css_rules).forEach(([css_selector, css_properties]) => {        // Iterate over each key (selector) in cssProperties
            const css_init          = `${css_selector} {}`;                                     // note: it looks like at the moment there isn't another way to create an empty CSSStyleRule and populate it
            const rules_length      = styleSheet.cssRules.length                                // get size of css rules
            const insert_position   = styleSheet.insertRule(css_init, rules_length);            // so that we can create a new one at the end
            const cssRule           = styleSheet.cssRules[insert_position];                     // get a reference to the one we added
            this.populate_rule(cssRule, css_properties);                                        // populate new css rule with provided css properties
        });
        return styleSheet
    }

    query_selector(selector) {
        return this.shadow_root().querySelector(selector)
    }

    parent_element() {
        return this.parentElement
    }

    set_inner_html(inner_html) {
        this.shadowRoot.innerHTML = inner_html
    }

    shadow_root() {
        return this.shadowRoot
    }

    shadow_root_append(child) {
        return this.shadowRoot.appendChild(child)
    }

    stylesheets(include_root=true, include_shadow=true) {
        const all_stylesheets =[]
        if (include_root) {
            all_stylesheets.push(...Array.from(this.shadowRoot.styleSheets)) }
        if (include_shadow) {
            all_stylesheets.push(...this.shadowRoot.adoptedStyleSheets) }
        // this is required for Safari which was duplicating the entires
        return all_stylesheets.filter((stylesheet, index, self) =>      // return unique list
            index === self.findIndex(s => s === stylesheet))
        return all_stylesheets
    }

    populate_rule(css_rule, css_properties) {
        for (let prop_name in css_properties) {
            const css_prop_name = prop_name.replace(/([A-Z])/g, '-$1').toLowerCase();           // Convert camelCase to kebab-case
            const css_prop_value = css_properties[prop_name]                                    // get css prop value
            css_rule.style.setProperty(css_prop_name, css_prop_value);                          // set property in css_rule
        }
    }

    async wait_for(duration=1000) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
}

