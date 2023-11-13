import Simple_Web_Component  from '../../../src/html_blocks/web_components/Simple_Web_Component.js'

QUnit.module('Simple_Web_Component', function(hooks) {

        hooks.before(() => {
        // Setup before tests run.
            customElements.define('my-custom-component', Simple_Web_Component);
            this.my_custom_component = document.body.appendChild(document.createElement('my-custom-component'));
            this.remove_on_exit = false

    });

    hooks.after((assert) => {
        assert.equal(document.querySelector('my-custom-component'), this.my_custom_component)
        if (this.remove_on_exit) {
            this.my_custom_component.remove()
            assert.equal(document.querySelector('my-custom-component'), null)
        }

    });

    QUnit.test('root_element', (assert) => {
        const expected_html = `<div class="content">${this.my_custom_component.text_content()}</div>`
        const root_element = this.my_custom_component.root_element()
        assert.equal(root_element.html(), expected_html)
        console.log(expected_html)
        assert.equal(root_element.html(), this.my_custom_component.html())
        //assert.ok(root_element, 'root element was defined')
        //assert.expect(2)
    })

    QUnit.only('Component content test', assert => {
        const component = document.querySelector('my-custom-component');
        const shadowContent = component.shadowRoot.querySelector('.content').textContent;

        assert.equal(shadowContent, 'Hello, this is my custom component!', 'The content of the component should match.');

        assert.equal(component.shadowRoot.adoptedStyleSheets.length,1)
        const styleSheet = component.shadowRoot.adoptedStyleSheets[0]
        assert.equal(styleSheet.cssRules.length, 2)

    });

    QUnit.only ('CSS properties assignment test', assert => {
        const component             = document.querySelector('my-custom-component');
        const computedStyle         = getComputedStyle(component);
        const expectedCssProperties = component.css_properties();

        // deal with the color's auto converstion into rgb
        assert.equal(computedStyle        .backgroundColor, 'rgb(255, 255, 255)')
        assert.equal(expectedCssProperties.backgroundColor, 'white'             )
        const whiteInRgb = 'rgb(255, 255, 255)';
        assert.notEqual(computedStyle.backgroundColor, expectedCssProperties.backgroundColor, 'Background color should not match directly');
        assert.equal(computedStyle.backgroundColor   , whiteInRgb                           , 'Background color should be whiteInRgb');

        assert.equal(computedStyle        .borderColor, 'rgb(0, 0, 0)')
        assert.equal(expectedCssProperties.borderColor, 'black'       )
        assert.notEqual(computedStyle.borderColor, expectedCssProperties.borderColor)

        //todo figure out why fontFamily doesn't match in wallby
        if (document.location.href.includes('wallaby')) {
            assert.notEqual(computedStyle.fontFamily, expectedCssProperties.fontFamily)
            assert.equal(computedStyle        .fontFamily, 'Poppins, sans-serif')
            assert.equal(expectedCssProperties.fontFamily, 'Arial, sans-serif'  )
        }
        else {
            assert.equal(computedStyle.fontFamily, expectedCssProperties.fontFamily )
        }


        //todo figure out why fontFamily doesn't match in wallby
        if (document.location.href.includes('wallaby')) {
            assert.equal(computedStyle        .padding, '0px')
            assert.equal(expectedCssProperties.padding, '10px'  )
            assert.notEqual(computedStyle.padding, expectedCssProperties.padding)
        }
        else {
            assert.equal(computedStyle.padding, expectedCssProperties.padding)
        }


        // Check if the computed styles match the expected CSS properties.
        assert.equal(computedStyle.zIndex, expectedCssProperties.zIndex.toString(), 'Z-index should match.');
        assert.equal(computedStyle.position, expectedCssProperties.position, 'Position should match.');

        // For color, we have to get the computed style of the child element
        const contentStyle = getComputedStyle(component.shadowRoot.querySelector('.content'));
        assert.equal(contentStyle.color, 'rgb(0, 0, 255)', 'Content color should match.'); // Convert color name to RGB for comparison
    });

});

