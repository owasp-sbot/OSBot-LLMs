import Data__Chat_Bot from '../../../src/html_blocks/data/Data__Chat_Bot.js';

QUnit.module('Data__Chat_Bot', function(hooks) {

    hooks.before((assert) =>{
        this.data_chat_bot = new Data__Chat_Bot()
    })

    QUnit.test('constructor', (assert)=>{
        assert.ok       (this.data_chat_bot instanceof Data__Chat_Bot)
        assert.equal    (Data__Chat_Bot.prototype.constructor,Data__Chat_Bot, 'check Data__Chat_Bot constructor')
        assert.propEqual(this.data_chat_bot.system_prompts, [])
        assert.propEqual(this.data_chat_bot.user_messages , [])
    })

    QUnit.test('.add_system_prompt .remove_system_prompt', (assert)=> {
        const system_prompt = "an system prompt"
        assert.propEqual(this.data_chat_bot.system_prompts, [])
        assert.equal(this.data_chat_bot.add_system_prompt(system_prompt), this.data_chat_bot)
        assert.propEqual(this.data_chat_bot.system_prompts, [system_prompt])
        assert.equal(this.data_chat_bot.remove_system_prompt(system_prompt), this.data_chat_bot)
        assert.propEqual(this.data_chat_bot.system_prompts, [])
    })

    QUnit.test('.add_user_message',  (assert)=> {
        const message      = "an user message"
        const type         = "sent"
        const user_message = {message: message, type:type}
        assert.propEqual(this.data_chat_bot.user_messages, [])
        assert.equal(this.data_chat_bot.add_user_message(message,type), this.data_chat_bot)
        assert.propEqual(this.data_chat_bot.user_messages, [user_message])
        assert.equal(this.data_chat_bot.remove_user_message(message,type), this.data_chat_bot)
        assert.propEqual(this.data_chat_bot.user_messages, [])
    })
});
