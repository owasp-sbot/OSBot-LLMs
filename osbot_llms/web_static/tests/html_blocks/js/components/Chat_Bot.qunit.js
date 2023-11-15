import Chat_Bot          from '../../../../src/html_blocks/js/components/Chat_Bot.js';
import WebC__Chat_Bot    from "../../../../src/html_blocks/web_components/WebC__Chat_Bot.js";
import Dynamic_Rows_Cols from '../../../../src/html_blocks/web_components/Dynamic_Rows_Cols.js'

QUnit.module('Chat_Bot', function(hooks) {

    hooks.before((assert) =>{
        this.chat_bot = new Chat_Bot()
        assert.equal(this.chat_bot.define(), true)
    })

    QUnit.test('constructor', (assert)=>{
        assert.equal(Chat_Bot.prototype.constructor,Chat_Bot, 'check Chat_Bot constructor')
        assert.equal(this.chat_bot.webc_name    , 'chat-bot'    )
        assert.equal(this.chat_bot.webc_class   , WebC__Chat_Bot)
        assert.equal(this.chat_bot.webc_defined , true          )           // we are calling this.chat_bot.define() in hooks.before
    })

    QUnit.only('.add_to_page',  (assert)=>{
        const chat_bot_div = this.chat_bot.add_to_page({top:'10px', right:'10px'})
        chat_bot_div.remove()
        assert.ok(true)
    })

    QUnit.only('_using Dynamic_Rows_Cols',  (assert)=> {
        assert.ok(true)
        this.element_name = 'dynamic-rows-cols'
        this.element_class = Dynamic_Rows_Cols
        customElements.define(this.element_name, this.element_class);
        const dynamic_row_cols = document.createElement(this.element_name)
        document.body.appendChild(dynamic_row_cols);
        dynamic_row_cols.create_target_div()
        dynamic_row_cols.build()
        const cells = dynamic_row_cols.shadowRoot.querySelectorAll('.flex-col')
        assert.equal(cells.length, 8)

        const webc__chat_bot      = this.chat_bot.create_element_in_document_body()
        const css_rules__chat_bot = webc__chat_bot.css_rules__chat_bot()
        const styleSheet          = webc__chat_bot.create_stylesheet_from_css_rules(css_rules__chat_bot)
        dynamic_row_cols.add_adopted_stylesheet(styleSheet)

        cells[0].parentNode.style.height = '200px'
        cells[5].parentNode.style.height = '200px'
        cells[7].parentNode.style.height = '200px'
        webc__chat_bot.add_chat_bot_to_element(cells[0])
        webc__chat_bot.add_chat_bot_to_element(cells[1])
        webc__chat_bot.add_chat_bot_to_element(cells[5])
        webc__chat_bot.add_chat_bot_to_element(cells[7])

        //cell_1.innerHTML =' aaaaa bbb '
        //dynamic_row_cols.remove()
        window.cells = cells
        window.chat_bot = this.chat_bot

        window.dynamic_row_cols = dynamic_row_cols

    });


    QUnit.test('define', (assert)=>{
        // assert.equal(this.chat_bot.webc_defined , false)
        // assert.equal(this.chat_bot.define()     , true )
        assert.equal(this.chat_bot.webc_defined , true )
        assert.equal(this.chat_bot.define()     , false)
    })

});
