import Tag   from '../../src/html_blocks/js/Tag.js';
import Text  from '../../src/html_blocks/js/Text.js';
import Div  from '../../src/html_blocks/js/Div.js';
import H     from '../../src/html_blocks/js/H.js';
//import Html  from '../../src/html_blocks/js/Html.js';

QUnit.module('chatbot-via-js', function(hooks) {


    hooks.before(function (assert) {
        const done = assert.async();
        if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {
            var virtual_path = "../../../../../OSBot-LLMs/osbot_llms/web_static/src/chatbot"
        } else {
            var virtual_path = "/static/src/chatbot"
        }
        //var virtual_path = "/static/src/chatbot"
        const page_path = `${virtual_path}/chatbot-control.html`
        $.get(page_path, (data) => {
            this.data = data
            done()
        });

    })

    QUnit.test('load data', function (assert) {
        const $data = $(this.data)
        assert.equal($data.html().includes('<ul class="chatbox'),true)
        assert.equal($data.find('.chatbox').length,1)
        $data.find('.chatbox').remove()
        $data.find('.chat-input').remove()
        assert.equal($data.find('.chatbox').length,0)
        assert.equal($data.html().includes('<ul class="chatbox'),false)
        //console.log($data.html())
    })

    QUnit.test('create chatbot html from js',  function (assert) {
        const target_html_value =
`<div class="show-chatbot">
    <div class="chatbot">
        <header>
            <h2>Chatbot</h2>
            <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="material-symbols-outlined">smart_toy</span>
                <p>Hi there 👋<br>How can I help you today?</p>
            </li>
        </ul>
        <div class="chat-input">
            <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
            <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
    </div>
</div>
`
        const html_value =
`<div class="show-chatbot">
    <div class="chatbot">
        <header>
            <h2>Chatbot</h2>
            <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="material-symbols-outlined">smart_toy</span>
                <p>Hi there 👋<br>How can I help you today?</p>
            </li>
        </ul>
        <div class="chat-input">
            <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
            <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
    </div>
</div>
`
        const tag = new Tag()
        tag.html_config.include_id = false

        const span  = new Text({tag:'span'})
        span.html_config.new_line_after_final_tag = true
        span.html_config.include_id               = false
        span.html_config.indent_before_last_tag   = false
        span.html_config.new_line_before_elements = false


        const div_show_chatbot = tag.clone ({tag:'div'     , class:'show-chatbot'                                         })
        const div_chatbot      = tag.clone ({tag:'div'     , class:'chatbot'                                              })
        const header           = tag.clone ({tag:'header'                                                                 })
        const h2               = new H     ({                level:2, value:'Chatbot'                                     })
        const span_close       = span.clone({                class:'close-btn material-symbols-outlined', value:'close'   })
        const ul_chatbox       = tag.clone ({tag:'ul'      , class:'chatbox'                                              })
        const li_chat_incoming = tag.clone ({tag:'li'      , class:'chat incoming'                                        })
        const span_material    = span.clone({                class:'material-symbols-outlined', value:'smart_toy'         })
        const p                = span.clone({tag:'p'       , value:'Hi there 👋<br>How can I help you today?'             })
        const div_chat_input   = tag.clone ({tag:'div'     , class:'chat-input'                                           })
        const textarea         = new Tag   ({tag:'textarea', attributes:{placeholder:"Enter a message...", spellcheck:"false", required:null}})
        const span_send_btn    = new Text  ({tag:'span'    , class:'material-symbols-rounded', value:'send', id:'send-btn'})

        div_show_chatbot .add(div_chatbot     )
        div_chatbot      .add(header          )
        header           .add(h2              )
        header           .add(span_close      )
        div_chatbot      .add(ul_chatbox      )
        ul_chatbox       .add(li_chat_incoming)
        li_chat_incoming .add(span_material   )
        li_chat_incoming .add(p               )
        div_chatbot      .add(div_chat_input  )
        div_chat_input   .add(textarea        )
        div_chat_input   .add(span_send_btn   )

        h2           .html_config.include_id               = false
        span_send_btn.html_config.new_line_after_final_tag = true
        textarea.html_config.include_id                    = false
        textarea.html_config.indent_before_last_tag        = false
        textarea.html_config.new_line_before_elements      = false

        //console.log(div_show_chatbot.html())
        //console.log(html_value)
        //assert.expect(0)
        assert.equal(html_value, div_show_chatbot.html())
        assert.equal(html_value, target_html_value      )
    })


})