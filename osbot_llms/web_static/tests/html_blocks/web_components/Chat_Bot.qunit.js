import Chat_Bot         from '../../../src/html_blocks/web_components/Chat_Bot.js'
import Web_Component    from '../../../src/html_blocks/web_components/Web_Component.js'
import Div              from "../../../src/html_blocks/js/Div.js";

QUnit.module('Chat_Bot', function(hooks) {

    hooks.before(() => {
        this.element_name = 'chat-bot'
        this.element_class = Chat_Bot

        customElements.define(this.element_name, this.element_class);

        this.element_chat_bot = document.createElement(this.element_name)
        this.dom_chat_bot = document.body.appendChild(this.element_chat_bot);
        this.remove_on_exit = true
    });

    hooks.after((assert) => {
        assert.equal(document.querySelector(this.element_name), this.dom_chat_bot)
        if (this.remove_on_exit) {
            this.dom_chat_bot.remove()
            //assert.equal(document.querySelector(this.element_name), null)
        }
    });

    QUnit.test('constructor', (assert) => {
        assert.ok(this.dom_chat_bot instanceof Chat_Bot, 'dom_chat_bot is instance of Simple_Web_Component')
        assert.ok(Chat_Bot.prototype instanceof Web_Component, 'Simple_Web_Component.prototype is an instance of Web_Component');
    })


    QUnit.only('test with chat bot',  async (assert) => {

        const dom_chat_bot_1 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_2 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_3 = document.body.appendChild(document.createElement(this.element_name));
        const dom_chat_bot_4 = document.body.appendChild(document.createElement(this.element_name));
        dom_chat_bot_1.create_target_div({right:"12px"})
        dom_chat_bot_2.create_target_div({right:"250px"})
        dom_chat_bot_3.create_target_div({right:"450px"})
        dom_chat_bot_4.create_target_div({right:"850px"})

        dom_chat_bot_1.build()
        dom_chat_bot_2.build()
        dom_chat_bot_3.build()
        dom_chat_bot_4.build()
        assert.ok(true)
    })
})