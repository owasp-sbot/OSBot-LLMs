import WebC__Target_Div   from '../../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component      from "../../../src/html_blocks/web_components/Web_Component.js";


QUnit.module('WebC__Target_Div', function(hooks) {

    QUnit.test('constructor', (assert) => {
        assert.equal(WebC__Target_Div.element_name, 'webc-target-div'    , 'WebC__Target_Div element name was correctly set'           )
        assert.ok   (WebC__Target_Div.prototype instanceof Web_Component , 'WebC__Target_Div.prototype is an instance of Web_Component');
    })


    QUnit.test('build',  (assert) => {
        const webc_target_div = WebC__Target_Div.add_to_body().build()
        //const target_div     = this.webc_target_div.build()
        const target_element = webc_target_div.target_element
        console.log(target_element)
        assert.equal(webc_target_div.outerHTML    , '<webc-target-div></webc-target-div>')
        assert.equal(target_element.outerHTML, '<div id="target_div_id" class="target_div">\n    <slot>\n    </slot>\n</div>')
        const html            = webc_target_div.html     ();
        const cssRules        = webc_target_div.css_rules();
        const computedStyle   = window.getComputedStyle(target_element);
        const skip_properties = ['backgroundColor', 'width', 'height', 'left', 'border']                    // skip these because values are a little bit different

        Object.entries(cssRules[".target_div"]).forEach(([property, expectedValue]) => {
            if (!skip_properties.includes(property)) {
                const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());         // Convert the property to camelCase as computedStyle uses camelCase
                assert.equal(computedStyle[camelCaseProperty], expectedValue, `Property ${property} should be ${expectedValue}`);
            }
        });
        webc_target_div.remove()
    })
})