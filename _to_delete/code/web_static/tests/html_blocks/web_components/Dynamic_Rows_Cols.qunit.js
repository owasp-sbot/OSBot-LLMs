import Dynamic_Rows_Cols    from '../../../src/html_blocks/web_components/Dynamic_Rows_Cols.js'

QUnit.module('Dynamic_Rows_Cols', function(hooks) {

    hooks.before(() => {
        this.element_name = 'dynamic-rows-cols'
        this.element_class = Dynamic_Rows_Cols
        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
        this.remove_after    = true
    })

    hooks.after(() => {
        if (this.remove_after) {
            this.dom_chat_bot.remove() }
    })

    QUnit.test('build', async (assert) => {
        this.dom_chat_bot.create_target_div({top:"100px", left:'50%'})
        this.dom_chat_bot.build()
        assert.ok(this.element_chat_bot instanceof HTMLElement)
        //assert.ok(this.element_chat_bot instanceof Dynamic_Rows_Cols ) // todo add check for Dynamic_Rows_Cols since this is false
        assert.ok(this.dom_chat_bot     instanceof HTMLElement)
        assert.equal(typeof(this.dom_chat_bot.create_container_div), 'function')
    })
})