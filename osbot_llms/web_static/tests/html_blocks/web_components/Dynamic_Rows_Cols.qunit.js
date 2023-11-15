import Dynamic_Rows_Cols    from '../../../src/html_blocks/web_components/Dynamic_Rows_Cols.js'

QUnit.module('Dynamic_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'dynamic-rows-cols'
        this.element_class = Dynamic_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
    })

    hooks.after(() => {
        this.dom_chat_bot.remove()
    })

    QUnit.test('build', async (assert) => {
        this.dom_chat_bot.create_target_div()
        this.dom_chat_bot.build()
        assert.ok(true)
    })
})