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

    QUnit.test('.add_to_page',  (assert)=>{
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

        cells[0].parentNode.style.height = '100px'
        cells[5].parentNode.style.height = '100px'
        cells[7].parentNode.style.height = '100px'
        webc__chat_bot.add_chat_bot_to_element(cells[0])
        webc__chat_bot.add_chat_bot_to_element(cells[1])
        webc__chat_bot.add_chat_bot_to_element(cells[5])
        webc__chat_bot.add_chat_bot_to_element(cells[7])

        // tweak styles

        const div_right_style = dynamic_row_cols.shadowRoot.querySelector('.right-div').style
        const chatbox_ui_style = dynamic_row_cols.shadowRoot.querySelector('.chatbot-ui').style

        div_right_style.top   = '0px'
        div_right_style.right = '10px'
        div_right_style.left  = 'unset'
        div_right_style.width  = '70%'
        div_right_style.fontSize = '6px'
        div_right_style.border = 'unset'
        chatbox_ui_style.border = '2px solid blue'                                                      // this will impact on
        dynamic_row_cols.shadowRoot.adoptedStyleSheets[1].cssRules[1].style.border = '3px solid green'  // this will impact all
        dynamic_row_cols.shadowRoot.adoptedStyleSheets[0].cssRules[4].style.border = '1px dashed red'
        window.dynamic_row_cols = dynamic_row_cols
        //webc__chat_bot.remove()
        //dynamic_row_cols.remove()

    });


    QUnit.test('define', (assert)=>{
        // assert.equal(this.chat_bot.webc_defined , false)
        // assert.equal(this.chat_bot.define()     , true )
        assert.equal(this.chat_bot.webc_defined , true )
        assert.equal(this.chat_bot.define()     , false)
    })

});
