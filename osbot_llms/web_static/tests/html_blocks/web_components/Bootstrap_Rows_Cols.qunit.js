import Bootstrap_Rows_Cols    from '../../../src/html_blocks/web_components/Bootstrap_Rows_Cols.js'

QUnit.module('Bootstrap_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'bootstrap-rows-cols'
        this.element_class = Bootstrap_Rows_Cols
        customElements.define(this.element_name, this.element_class);
    })

    QUnit.only('create_target_div', async (assert) => {
        const element_name     = this.element_name
        const element_chat_bot = document.createElement(element_name)
        const dom_chat_bot     = document.body.appendChild(element_chat_bot);

        //dom_chat_bot.shadowRoot.innerHTML = inner_html
        dom_chat_bot.create_target_div()

        // const result = await dom_chat_bot.load_html_page()
        //
        // assert.equal(result, 'ok')
        dom_chat_bot.set_inner_html_manually()

        assert.ok(true)
        window.dom_chat_bot= dom_chat_bot
    })
})