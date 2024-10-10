import Bootstrap_Rows_Cols    from '../../../src/html_blocks/web_components/Bootstrap_Rows_Cols.js'

QUnit.module('Bootstrap_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'bootstrap-rows-cols'
        this.element_class = Bootstrap_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
    })

    hooks.after(() => {
        this.dom_chat_bot.remove()
    })

    QUnit.test('build',  async (assert) => {
        this.dom_chat_bot.create_target_div()
        await this.dom_chat_bot.load_bootstrap()
        this.dom_chat_bot.build()
        assert.ok(true)
    })
})