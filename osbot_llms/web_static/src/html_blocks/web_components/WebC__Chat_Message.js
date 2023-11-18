import Web_Component from "./Web_Component.js";
import Tag           from "../js/Tag.js";
import Div           from "../js/Div.js";

export default class WebC__Chat_Message extends Web_Component {
    constructor() {
        super();
    }

    //static get element_name() { return 'webc-chat-message'; }


    target_div_add({target_div_id='target_div_id', ...kwargs}={}) {
        const css_rules__target_div = this.target_div_css_rules(kwargs)
        this.add_css_rules(css_rules__target_div)
        const target_div_html = this.target_div_html(target_div_id)
        this.set_inner_html(target_div_html)
        return this.shadow_root().querySelector(`#${target_div_id}`)
    }

    target_div_html(chat_bot_id) {
        const target_div = new Div({id:chat_bot_id, class:'target_div'})
        return target_div.html()
    }

    target_div_css_rules({right="10px" , left=null, width=null, top="10px", bottom="10px", height=null}={}) {
        return {    ".target_div"     : { border         : "3px solid #724ae8",
                                          bottom         : bottom            ,
                                          left           : left              ,
                                          overflow       : "auto"            ,
                                          position       : "fixed"           ,
                                          right          : right             ,
                                          top            : top               ,
                                          height         : height            ,
                                          width          : width || '70%'    ,
                                          "z-index"      : "1000"            ,
                                          backgroundColor: "white"          }}
    }

    css_messages() { return {   "*"         : { "font-family"     : "Verdana"         ,
                                                "padding"         : "10px"            },
                                ".messages" : { "display"         : "flex"            ,
                                                "flex-direction"  : "column"          ,
                                                "overflow-y"      : "auto"            },
                                ".message"  : { "margin-bottom"   : "10px"            ,
                                                "max-width"       : "80%"             },
                                ".received" : { "background-color": "#f2f2f2"         ,
                                                "align-self"      : "flex-start"      ,
                                                "border-radius"   : "10px 10px 10px 0px"},
                                ".sent"     : { "background-color": "#724ae8"         ,
                                                "align-self"      : "flex-end"        ,
                                                "color"           : "#fff"            ,
                                                "border-radius"   : "10px 10px 0 10px"}}
    }


    templates_html() {
        const templates                 = new Tag({tag:'div'     , id   :'templates'                    })
        const template_sent             = new Tag({tag:'template', id   :'template_sent'                })
        const template_sent_message     = new Tag({tag:'div'     , class:'message sent'     , value:''  })
        const template_received         = new Tag({tag:'template', id   :'template_received'            })
        const template_received_message = new Tag({tag:'div'     , class:'message received'   , value:''})

        template_sent_message    .html_config.include_id = false
        template_received_message.html_config.include_id = false

        templates        .add(template_sent             )
        templates        .add(template_received         )
        template_sent    .add(template_sent_message     )
        template_received.add(template_received_message )
        return templates.html()
    }
}
