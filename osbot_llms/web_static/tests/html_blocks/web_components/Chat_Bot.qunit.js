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

    // QUnit.only('build', async (assert) => {
    //     this.element_chat_bot.build()
    //     const css_rules = this.element_chat_bot.get_css_rules()
    //     this.element_chat_bot.add_css_rules(css_rules)
    //     assert.ok(true)
    // })
    QUnit.test('fix css and fit two chatbots side by side', async (assert) => {
        const id_box_1  = 'div_box_1'
        const div_box_1 = this.element_chat_bot.add_div_box({id: id_box_1 , bottom:"65%", left:'20%', border: "2px dashed blue"})
        const div_box_2 = this.element_chat_bot.add_div_box({top:"65%", left:'20%'   , border: "2px dashed black"})
        //console.log(div_box_1)

        const element_chat_bot_1 = document.createElement(this.element_name)
        const dom_chat_bot_1     = div_box_1.dom().appendChild(this.element_chat_bot);
        dom_chat_bot_1.build()
        assert.ok(true)

        const div3zlkw = document.getElementById(id_box_1);

        const { width, height } = div3zlkw.getBoundingClientRect();

        // Step 2: Access the shadow DOM of chat-bot
        const chatBot = div3zlkw.querySelector('chat-bot');
        const shadowRoot = chatBot.shadowRoot;

        // Step 3: Set the size of .chatbox
        const chatbox = shadowRoot.querySelector('.chatbox');
        if (chatbox) {
            chatbox.style.width = `${width}px`;
            chatbox.style.height = `${height}px`;
    // Additional styles (such as overflow handling) can be set here if necessary
} 

    })

    // QUnit.only('get_css_rules', async (assert) => {
    //     const css_rules = this.element_chat_bot.get_css_rules()
    //     assert.expect(0)
    //     //await this.element_chat_bot.load_css_from_url()
    // })
});

