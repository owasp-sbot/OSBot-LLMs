import Chat_Bot          from '../../../../src/html_blocks/js/components/Chat_Bot.js';
import WebC__Chat_Bot    from "../../../../src/html_blocks/web_components/WebC__Chat_Bot.js";
import Dynamic_Rows_Cols from '../../../../src/html_blocks/web_components/Dynamic_Rows_Cols.js'

QUnit.module('Chat_Bot', function(hooks) {

    hooks.before(() =>{
        //this.chat_bot = new Chat_Bot()
    })

    QUnit.test('constructor', (assert)=>{
        const chat_bot = new Chat_Bot()
        assert.equal(Chat_Bot.prototype.constructor,Chat_Bot, 'check Chat_Bot constructor')
        assert.equal(chat_bot.webc_name    , 'chat-bot'    )
        assert.equal(chat_bot.webc_class   , WebC__Chat_Bot)
    })

    QUnit.test('.create_and_add_to_body', (assert)=>{
        const webc_chat_bot = Chat_Bot.create_and_add_to_body({top:'100px', right:'10px', width:'30%'})
        assert.equal(webc_chat_bot.messages.add_message_received('an message').message(), 'an message')
        webc_chat_bot.parent_element().remove()
    })

    QUnit.test('.create_in_element (using Dynamic_Rows_Cols)',  (assert)=> {
        const ctor_style = {top:"100px", left:"75%"}
        const dynamic_row_cols = Dynamic_Rows_Cols.create()
        document.body.appendChild(dynamic_row_cols);
        dynamic_row_cols.create_target_div(ctor_style)
        dynamic_row_cols.build()
        const cells = dynamic_row_cols.shadowRoot.querySelectorAll('.flex-col')
        assert.equal(cells.length, 8)

        cells[0].parentNode.style.height = '30%'
        cells[0].style.width                = '30%'
        cells[0].style.flex                 = 'auto'
        cells[1].style.width                = '70%'
        cells[1].style.flex                 = 'auto'
        cells[5].parentNode.style.height    = '15%'
        cells[5].style.width                = '80%'
        cells[5].style.flex                 = 'auto'
        cells[7].parentNode.style.height    = '40%'

        const web_chat_bot_1 = Chat_Bot.create_in_element(cells[0])
        const web_chat_bot_2 = Chat_Bot.create_in_element(cells[1])
        const web_chat_bot_3 = Chat_Bot.create_in_element(cells[5])
        const web_chat_bot_4 = Chat_Bot.create_in_element(cells[7])

        web_chat_bot_1.messages.add_message_sent('sent 1')
        web_chat_bot_2.messages.add_message_sent('sent 2')
        web_chat_bot_3.messages.add_message_sent('sent 3')
        web_chat_bot_4.messages.add_message_sent('sent 4')

        // tweak styles
        const div_right_style = dynamic_row_cols.shadowRoot.querySelector('.right-div').style
        div_right_style.bottom   = '0%'
        div_right_style.top      = '0%'
        div_right_style.right    = '20px'
        div_right_style.left     = 'unset'
        div_right_style.width    = '50%'
        div_right_style.fontSize = '6px'
        div_right_style.border   = '2px solid purple'

        dynamic_row_cols.remove()
    });


    QUnit.only('test chat_bot_funcionality', (assert)=>{
        const webc_chat_bot = Chat_Bot.create_and_add_to_body({top:'100px', right:'10px', width:'60%'})
        assert.equal(webc_chat_bot.messages.add_message_received('an message').message(), 'an message')
        webc_chat_bot.parent_element().remove()
        //window.webc_chat_bot = webc_chat_bot
    })

});
