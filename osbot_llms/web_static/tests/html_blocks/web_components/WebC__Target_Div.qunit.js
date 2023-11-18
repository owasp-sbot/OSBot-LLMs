import WebC__Target_Div   from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component      from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Target_Div', function(hooks) {

    hooks.before((assert) => {
        this.element_name    = WebC__Target_Div.element_name
        this.element_class   = WebC__Target_Div
        this.webc_target_div = WebC__Target_Div.create_element_add_to_body()
        this.remove_on_exit  = true
    });

    hooks.after((assert) => {
        assert.equal(document.querySelector(this.element_name), this.webc_target_div)
        if (this.remove_on_exit) {
            this.webc_target_div.remove()
        }
    });

    QUnit.test('constructor', (assert) => {
        assert.equal(this.element_name          , 'webc-target-div'         , 'WebC__Target_Div element name was correctly set'           )
        assert.ok   (this.webc_target_div       instanceof WebC__Target_Div , 'webc_chat_message is instance of WebC__Target_Div'         )
        assert.ok   (WebC__Target_Div.prototype instanceof Web_Component    , 'WebC__Target_Div.prototype is an instance of Web_Component');
    })


    QUnit.test('build',  (assert) => {
        const target_div     = this.webc_target_div.build()
        const target_element = target_div.target_element
        assert.equal(target_div.outerHTML    , '<webc-target-div></webc-target-div>')
        assert.equal(target_element.outerHTML, '<div id="target_div_id" class="target_div">\n    <slot>\n    </slot>\n</div>')
        const html            = this.webc_target_div.html     ();
        const cssRules        = this.webc_target_div.css_rules();
        const computedStyle   = window.getComputedStyle(target_element);
        const skip_properties = ['backgroundColor', 'width', 'height', 'left', 'border']                    // skip these because values are a little bit different

        Object.entries(cssRules[".target_div"]).forEach(([property, expectedValue]) => {
            if (!skip_properties.includes(property)) {
                const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());         // Convert the property to camelCase as computedStyle uses camelCase
                assert.equal(computedStyle[camelCaseProperty], expectedValue, `Property ${property} should be ${expectedValue}`);
            }
        });
    })
})