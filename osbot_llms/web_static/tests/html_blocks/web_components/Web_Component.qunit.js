import Web_Component        from '../../../src/html_blocks/web_components/Web_Component.js'
import Simple_Web_Component from "../../../src/html_blocks/web_components/Simple_Web_Component.js";

QUnit.module('Web_Component', function(hooks) {

    hooks.before(() => {
        this.element_name = 'web-component'
        this.element_class = Web_Component

        customElements.define(this.element_name, this.element_class);
        this.web_element    = document.createElement(this.element_name)
        this.web_component  = document.body.appendChild(this.web_element);
        this.remove_on_exit = true
        window.web_element  = this.web_element
        window.web_component = this.web_component
    });

    hooks.after((assert) => {
        const dom_element = document.querySelector('web-component')
        assert.equal(dom_element, this.web_component)
        if (this.remove_on_exit) {
            dom_element.remove()
            assert.equal(document.querySelector('web-component'), null)
        }

    });

    QUnit.test('constructor', (assert) => {
        assert.ok(this.web_component      instanceof Web_Component, 'web_component is instance of Web_Component'           )
        assert.ok(Web_Component.prototype instanceof HTMLElement  , 'Web_Component.prototype is an instance of HTMLElement');

    })
    QUnit.test('root_element', (assert) => {
        const root_element = this.web_component.root_element()
        assert.equal(root_element, null)
    })

    QUnit.test('stylesheets', assert => {
        assert.propEqual(this.web_component.stylesheets(), [])
    });

    QUnit.test('stylesheet_from_css_properties', assert => {
        const css_rules_to_add = { 'aaa' : { top: '20px', position: 'absolute' }}
        const expected_css_text  = 'aaa { top: 20px; position: absolute; }'
        const stylesheet        = this.web_component.add_css_rules(css_rules_to_add)
        const css_rules         = stylesheet.cssRules
        const css_style_rule    = css_rules[0]
        assert.equal(css_rules.length, 1)
        assert.ok   (css_rules      instanceof CSSRuleList)
        assert.ok   (css_style_rule instanceof CSSStyleRule)
        assert.equal(css_style_rule.style.length , 2                                )
        assert.equal(css_style_rule.style.top     , css_rules_to_add['aaa'].top     )
        assert.equal(css_style_rule.style.position, css_rules_to_add['aaa'].position)
        assert.equal(css_style_rule.selectorText  , 'aaa'                           )
        assert.equal(css_style_rule.cssText,expected_css_text)
        assert.equal(css_style_rule.parentStyleSheet,stylesheet)

        const multiple_css_rules = { 'aaa' : {}, 'bbb':{} , 'cccc': {} }
        const stylesheet_2       = this.web_component.add_css_rules(multiple_css_rules)
        assert.equal(stylesheet_2.cssRules.length, 3)
    });

    // todo: fix this test
    QUnit.test('set_css_from_css_properties',  assert => {
        this.web_element.shadow_root().adoptedStyleSheets = []  // reset all stylesheets (created by the other tests)
        const aaa = document.createElement('aaa')
        const bbb = document.createElement('bbb')
        const ccc = document.createElement('ccc')
        this.web_element.shadow_root().appendChild(aaa)
        this.web_element.shadow_root().appendChild(bbb)
        this.web_element.shadow_root().appendChild(ccc)

        const target = this.web_component
        const css_rules_1 = { 'aaa' : { top: '10px', left  : '100px' }}
        const css_rules_2 = { 'bbb' : { top: '20px', right : '200px' }}
        const css_rules_3 = { 'ccc' : { top: '30px', bottom: '300px' },
                              'ddd' : { position:'absolute'          }}

        const stylesheet_1 = target.add_css_rules(css_rules_1)
        assert.equal(target.stylesheets()[0],stylesheet_1)
        assert.equal(target.stylesheets()[0].cssRules[0].cssText, 'aaa { top: 10px; left: 100px; }')

        const stylesheet_2 = target.add_css_rules(css_rules_2)
        assert.equal(target.stylesheets()[1],stylesheet_2)
        assert.equal(target.stylesheets()[1].cssRules[0].cssText, 'bbb { top: 20px; right: 200px; }')

        const stylesheet_3 = target.add_css_rules(css_rules_3)
        assert.equal(target.stylesheets()[2],stylesheet_3)
        assert.equal(target.stylesheets()[2].cssRules[0].cssText, 'ccc { top: 30px; bottom: 300px; }')
        assert.equal(target.stylesheets()[2].cssRules[1].cssText, 'ddd { position: absolute; }'      )


        const aaa_styles = getComputedStyle(aaa)
        const bbb_styles = getComputedStyle(bbb)
        const ccc_styles = getComputedStyle(ccc)

        assert.equal(aaa_styles.top   , "10px")
        assert.equal(bbb_styles.top   , "20px")
        assert.equal(ccc_styles.top   , "30px")

        assert.equal(aaa_styles.left  , "100px")
        assert.equal(bbb_styles.right , "200px")
        assert.equal(ccc_styles.bottom, "300px")

        const css_rules_4 = { 'aaa' : { top: '100px', left  : '500px' }}
        const stylesheet_4 = target.add_css_rules(css_rules_4)

        assert.propEqual(this.web_element.stylesheets(), [stylesheet_1,stylesheet_2,stylesheet_3,stylesheet_4])

        assert.equal(aaa_styles.top   , "100px")
        assert.equal(aaa_styles.left  , "500px")

    })

    QUnit.test('set_css_from_css_properties (css on :host)', assert => {
        const web_element    = document.createElement(this.element_name)
        const css_rules = { ':host' : { top: '100px', left  : '100px',position:'absolute'}}
        assert.propEqual(web_element.stylesheets(),[])                      // before add_css_rules stylesheets should be empyu
        web_element.add_css_rules(css_rules)                                // adding css rules
        assert.equal(web_element.stylesheets()[0].cssRules[0].cssText, ':host { top: 100px; left: 100px; position: absolute; }')
        const computed_style = getComputedStyle(web_element);
        assert.equal(computed_style.top, '')                                // before adding to body the computed style is empty
        const dom_element    = document.body.appendChild(web_element)       // add to dom
        assert.equal(computed_style.top, '100px')                           // now it matches
        dom_element.remove()                                                // remove from dom
    })

    QUnit.test('set_css_from_css_properties (css inner element)', assert => {
        const new_name       = 'new_element'
        const web_element    = document.createElement(this.element_name)
        const aaa            = document.createElement(new_name)
        web_element.shadow_root().appendChild(aaa)

        const css_rules = { [new_name] : { top: '100px', left  : '100px',position:'absolute'}}  // adding the rule to the [new_name] which in this case is 'new_element'
        assert.propEqual(web_element.stylesheets(),[])                      // before add_css_rules stylesheets should be empyu
        web_element.add_css_rules(css_rules)                                // adding css rules
        const computed_style = getComputedStyle(aaa);
        assert.equal(computed_style.top, '')                                // before adding to body the computed style is empty
        const dom_element    = document.body.appendChild(web_element)       // add to dom
        assert.equal(computed_style.top, '100px')                           // now it matches
        dom_element.remove()                                                // remove from dom
    })
});

