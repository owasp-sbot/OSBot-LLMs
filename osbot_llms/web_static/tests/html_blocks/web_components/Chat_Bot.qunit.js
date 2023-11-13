import Chat_Bot         from '../../../src/html_blocks/web_components/Chat_Bot.js'
import Web_Component    from '../../../src/html_blocks/web_components/Web_Component.js'

QUnit.module('Chat_Bot', function(hooks) {

    hooks.before(() => {
        this.element_name = 'chat-bot'
        this.element_class = Chat_Bot

        customElements.define(this.element_name, this.element_class);

        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot     = document.body.appendChild(this.element_chat_bot);
        this.remove_on_exit = false
    });

    hooks.after((assert) => {
        assert.equal(document.querySelector(this.element_name), this.dom_chat_bot)
        if (this.remove_on_exit) {
            this.my_custom_component.remove()
            assert.equal(document.querySelector('my-custom-component'), null)
        }
    });

    QUnit.test('constructor', (assert) => {
        assert.ok(this.dom_chat_bot instanceof Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok(Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
    })

    QUnit.only('build', async (assert) => {
        this.element_chat_bot.build()
        const css_rules = this.element_chat_bot.get_css_rules()
        this.element_chat_bot.add_css_rules(css_rules)
        assert.ok(true)
        //await this.element_chat_bot.load_css_from_url()
    })

    // QUnit.only('get_css_rules', async (assert) => {
    //     const css_rules = this.element_chat_bot.get_css_rules()
    //     assert.expect(0)
    //     //await this.element_chat_bot.load_css_from_url()
    // })
});

