import Bootstrap_Rows_Cols    from '../../../src/html_blocks/web_components/Bootstrap_Rows_Cols.js'

QUnit.module('Bootstrap_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'bootstrap-rows-cols'
        this.element_class = Bootstrap_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
    })

    QUnit.only('create_target_div', async (assert) => {

        //dom_chat_bot.shadowRoot.innerHTML = inner_html
        this.dom_chat_bot.create_target_div()

        // const result = await dom_chat_bot.load_html_page()
        //
        const result = await this.dom_chat_bot.load_bootstrap()
        assert.equal(result, 'ok')
        this.dom_chat_bot.set_inner_html_manually()

        assert.ok(true)

    })

    QUnit.test('create_container_div', async (assert) => {
        const div = this.dom_chat_bot.create_container_div()
        //console.log(div.html())
        assert.expect(0)
    })
})