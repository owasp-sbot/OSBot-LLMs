import OpenAI_Config    from "../../src/chatbot_openai/OpenAI_Config.js";
import WebC__Target_Div from '../../src/html_blocks/web_components/WebC__Target_Div.js'
import Web_Component    from  "../../src/html_blocks/web_components/Web_Component.js";
import Tag              from "../../src/html_blocks/js/Tag.js";

QUnit.module('OpenAI_Config', function(hooks) {

    hooks.before(() =>{
        this.target_div    = WebC__Target_Div.add_to_body().build({width:"50%"})
        this.openai_config = this.target_div.append_child(OpenAI_Config)
        this.remove_target_div = false
    })
    hooks.after(() =>{
        if (this.remove_target_div) {
            this.target_div.remove()
        }
        //this.chat_bot = new Chat_Bot()
    })

    QUnit.test('constructor', (assert)=>{
        assert.ok       (this.openai_config instanceof Web_Component)
        assert.ok       (this.openai_config instanceof Web_Component)
    })


    QUnit.test('html',    (assert)=>{
        const html = this.openai_config.html()
        //console.log(html)
        ///window.openai_config = this.openai_config
        assert.ok(1)
    })






});
