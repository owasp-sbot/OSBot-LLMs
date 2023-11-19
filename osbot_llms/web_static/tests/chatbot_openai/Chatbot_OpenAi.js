import Chatbot_OpenAI   from "../../src/chatbot_openai/Chatbot_OpenAI.js";
import WebC__Target_Div from '../../src/html_blocks/web_components/WebC__Target_Div.js'
import WebC_Chat_Bot    from  "../../src/html_blocks/web_components/WebC__Chat_Bot.js";
import Web_Component    from  "../../src/html_blocks/web_components/Web_Component.js";

QUnit.module('Chatbot_OpenAI', function(hooks) {

    hooks.before(() =>{
        this.target_div    = WebC__Target_Div.add_to_body().build({width:"50%"})
        this.chatbot_openai = this.target_div.append_child(Chatbot_OpenAI)
        this.remove_target_div = false
    })
    hooks.after(() =>{
        if (this.remove_target_div) {
            this.target_div.remove()
        }
        //this.chat_bot = new Chat_Bot()
    })

    QUnit.test('constructor', (assert)=>{
        assert.ok       (this.chatbot_openai instanceof WebC_Chat_Bot)
        assert.ok       (this.chatbot_openai instanceof WebC_Chat_Bot)
    })

    QUnit.test('.post_openai_prompt_simple',  async (assert)=>{
        const message  = "Hello"
        const response = await this.chatbot_openai.post_openai_prompt_simple(message)
        assert.ok(response.length > 10, 'got an answer that was bigger than 10')
    })

    QUnit.only('.post_openai_prompt_with_stream',  async (assert)=>{
        const message  = "Hello"

        this.chatbot_openai.messages.add_message_sent(message)
        const response = await this.chatbot_openai.post_openai_prompt_with_stream(message)
        console.log(response)
        assert.ok(1)
    })

    QUnit.test('.add_event_listeners',  async (assert)=>{

        //this.chatbot_openai.messages.add_message_sent('hello')
        assert.ok(1)
    })






});
