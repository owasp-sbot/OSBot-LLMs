import Bootstrap_Rows_Cols    from '../../../src/html_blocks/web_components/Bootstrap_Rows_Cols.js'

QUnit.module('Bootstrap_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'bootstrap-rows-cols'
        this.element_class = Bootstrap_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
    })

    QUnit.only('build', async (assert) => {
        this.dom_chat_bot.create_target_div()
        await this.dom_chat_bot.load_bootstrap()
        this.dom_chat_bot.build()
        assert.ok(true)

    })

    QUnit.test('create_container_div', async (assert) => {
        const div = this.dom_chat_bot.create_container_div()
        //console.log(div.html())
        assert.expect(0)
    })
})