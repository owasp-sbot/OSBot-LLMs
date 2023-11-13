import Div_Chat_Bot from '../../../../src/html_blocks/js/components/Div_Chat_Bot.js';


QUnit.module('Div_Chat_Bot', function(hooks) {


    QUnit.test('.build', (assert)=>{
        const div_chat_bot = new Div_Chat_Bot()
        div_chat_bot.dom_add()
        assert.equal(document.getElementById('send-btn').innerHTML,'send')
        div_chat_bot.dom_remove()
        //console.log(div_chat_bot.html())
        //assert.expect(0)
    })

    //todo: refactor this to use Web Components and shadow dom
    // QUnit.only('.load_css', async (assert)=> {
    //     const div_chat_bot = new Div_Chat_Bot()
    //     const result = await div_chat_bot.load_css()
    //     div_chat_bot.dom_add()
    //     assert.expect(0)
    // })

});
