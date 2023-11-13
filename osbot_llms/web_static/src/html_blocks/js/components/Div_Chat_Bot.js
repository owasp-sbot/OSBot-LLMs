import H    from '../H.js'
import Tag  from '../Tag.js'
import Text from '../Text.js'

export default class Div_Chat_Bot extends Tag {
    constructor({...kwargs}={}) {
        super({...kwargs});
        this.build()
    }
    build() {
        const tag = new Tag()

        const span  = new Text({tag:'span'})
        span.html_config.new_line_after_final_tag = true
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
        textarea     .html_config.include_id               = false
        textarea     .html_config.indent_before_last_tag   = false
        textarea     .html_config.new_line_before_elements = false
        this.add(div_show_chatbot)
    }

    // async load_css() {
    //     return new Promise((resolve, reject) => {
    //         const link = document.createElement('link');
    //         link.rel = 'stylesheet';
    //         link.href = './div_chat_bot.style.css';
    //         link.onload = () => resolve(true);
    //         link.onerror = () => reject(new Error('div_chat_bot.style.css CSS failed to load'));
    //         document.head.appendChild(link);
    //     });
    // }
}