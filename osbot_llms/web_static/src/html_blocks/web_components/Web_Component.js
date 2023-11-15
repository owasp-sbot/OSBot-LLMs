export default class Web_Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.name = 'web-component'
    }

    add_adopted_stylesheet(stylesheet) {
        const currentStylesheets = this.shadowRoot.adoptedStyleSheets;
        this.shadowRoot.adoptedStyleSheets = [...currentStylesheets, stylesheet];
    }

    root_element() {
        return null
    }

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

    set_inner_html(inner_html) {
        this.shadowRoot.innerHTML = inner_html
    }

    shadow_root() {
        return this.shadowRoot
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
}