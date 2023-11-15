import Div_Chat_Bot from '../../../../src/html_blocks/js/components/Div_Chat_Bot.js';


//todo remove to 'early experiments' section
QUnit.module('Div_Chat_Bot', function(hooks) {


    QUnit.test('.build', (assert)=>{
        const div_chat_bot = new Div_Chat_Bot()
        div_chat_bot.dom_add()
        assert.equal(document.getElementById('send-btn').innerHTML,'send')
        div_chat_bot.dom_remove()
        //console.log(div_chat_bot.html())
        //assert.expect(0)
    })

});
