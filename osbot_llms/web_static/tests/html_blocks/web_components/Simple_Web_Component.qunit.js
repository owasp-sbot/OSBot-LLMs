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
        assert.equal(root_element.html(), this.my_custom_component.html())
    })

    QUnit.test('Component content test', assert => {
        const component = document.querySelector('my-custom-component');
        const shadowContent = component.shadowRoot.querySelector('.content').textContent;

        assert.equal(shadowContent, 'Hello, this is my custom component!', 'The content of the component should match.');

        assert.equal(component.shadowRoot.adoptedStyleSheets.length,1)
        const styleSheet = component.shadowRoot.adoptedStyleSheets[0]
        assert.equal(styleSheet.cssRules.length, 2)

    });

    QUnit.test('CSS properties assignment test', assert => {
        const component = document.querySelector('my-custom-component');
        const computedStyle = getComputedStyle(component);
        const expectedCssProperties = component.css_properties().host; // Get the 'host' properties

        // Background Color
        assert.equal(computedStyle.backgroundColor, 'rgb(255, 255, 255)', 'Background color should be white in RGB format.');
        assert.equal(expectedCssProperties.backgroundColor, 'white', 'Expected background color should be white.');

        // Font Family
        // Note: The specific font-family might be returned differently by different browsers or environments
        // Handling WallabyJS specific environment
        if (document.location.href.includes('wallaby')) {
            assert.notEqual(computedStyle.fontFamily, expectedCssProperties.fontFamily, 'Font family should not match in Wallaby environment.');
        } else {
            assert.equal(computedStyle.fontFamily.replace(/"/g, ''), expectedCssProperties.fontFamily, 'Font family should match.'); // Removing quotes for comparison
        }

        // Padding
        // Note: Padding might differ based on the environment (like WallabyJS)
        if (document.location.href.includes('wallaby')) {
            assert.notEqual(computedStyle.padding, expectedCssProperties.padding, 'Padding should not match in Wallaby environment.');
        } else {
            assert.equal(computedStyle.padding, expectedCssProperties.padding, 'Padding should match.');
        }

        // Border, Z-index and Position
        assert.equal(computedStyle.border, expectedCssProperties.border)
        assert.equal(computedStyle.zIndex, expectedCssProperties.zIndex.toString(), 'Z-index should match.');
        assert.equal(computedStyle.position, expectedCssProperties.position, 'Position should match.');

        // Content Color
        const contentStyle = getComputedStyle(component.shadowRoot.querySelector('.content'));
        assert.equal(contentStyle.color, 'rgb(0, 0, 255)', 'Content color should match.'); // Convert color name to RGB for comparison
    });

});

