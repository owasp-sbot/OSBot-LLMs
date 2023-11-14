import Web_Component from "./Web_Component.js";
import Div from "../js/Div.js";

export default class Bootstrap_Rows_Cols extends Web_Component {
    constructor() {
        super();
        //this.shadowRoot.innerHTML = '<div id="html_block" class="right-div">aaaa</div>'
    }

    create_target_div () {
        const css_rules = {".right-div": { "background-color": "white"         , /* Background color                                       */
                                            border           : "3px solid blue", /* Blue border with a thickness of 3px                    */
                                            bottom           : "120px"         , /* Space from the bottom                                  */
                                            overflow         : "auto"          , /* Enables scrollbars if content overflows                */
                                            padding          : "0"             , /* Padding inside the div, if needed                      */
                                            position         : "fixed"         , /* Fix the div to the right side of the screen            */
                                            right            : "60px"          , /* Space from the right                                   */
                                            top              : "60px"          , /* Space from the top                                     */
                                            width            : "50%"           , /* Occupy 50% of the screen width                         */
                                            "z-index"        : "1000"            /* High z-index to ensure it's in front of other elements */
                         }}
        this.set_inner_html('<div id="html_block" class="right-div">...content..</div>')
        this.add_css_rules(css_rules)
    }
    async load_html_page(){
        var virtual_path = "../../../src/html_blocks"
        var page_path      = `${virtual_path}/full_page_cols_rows.html`
        const html_data = await fetch(page_path)
                .then(res => res.text())
                .then(data => { return data} )
                .catch(error=> console.log(error))
        console.log(html_data)
        const target_div = this.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = html_data
        return 'ok'
    }

    set_inner_html_manually() {

        const css_rules = {
            ".container-fluid": {
                "min-height": "100%",
                display: "flex",
                "flex-direction": "column",
                padding: "0"
            },
            ".row": {
                flex: "1",
                display: "flex",
                margin: "0"
            },
            ".col-3, .col-4, .col-6, .col-12": {
                display: "flex",
                padding: "0"
            },
            ".chatbot-control": {
                border: "3px solid red",
                "flex-grow": "1",
                margin: "0px",
                display: "flex",
                "justify-content": "center",
                "align-items": "center"
            }
        };

        var styles =
`
<link href="../../../lib/bootstrap.min.css"     rel="stylesheet">
        <style>
        /*html, body {*/
        /*    height: 100%;*/
        /*    margin: 0;*/
        /*}*/
        .container-fluid {
            min-height: 100%;      /* Minimum height to fill the parent */
            display: flex;          /* Enable flexbox */
            flex-direction: column; /* Stack children vertically */
            padding: 0;
        }
        .row {
            flex: 1; /* Allow each row to grow */
            display: flex; /* Enable flexbox for direct children, which are the columns */
            margin: 0; /* Remove any default margin */
        }
        .col-3, .col-4, .col-6, .col-12 {
            display: flex;
            padding: 0; /* Override Bootstrap padding */
        }

        .chatbot-control {
            border: 3px solid red;
            flex-grow: 1;
            margin: 0px;
            display: flex;
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
        }
        </style>
`
        const container =
`
    <div class="container-fluid"> <!-- Full height container -->
        <div class="row">
            <div class="col-6">
                <div id="chatbot-control-1" class="chatbot-control">
                    1
                </div>
            </div>
            <div class="col-6">
                <div id="chatbot-control-2" class="chatbot-control">
                    2
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <div id="chatbot-control-3" class="chatbot-control">
                    3
                </div>
            </div>
            <div class="col-4">
                <div id="chatbot-control-4" class="chatbot-control">
                    4
                </div>
            </div>
            <div class="col-4">
                <div id="chatbot-control-5" class="chatbot-control">
                    4
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div id="chatbot-control-3" class="chatbot-control">
                    5
                </div>
            </div>
            <div class="col-6">
                <div id="chatbot-control-4" class="chatbot-control">
                    6
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-3">
                <div id="chatbot-control-3" class="chatbot-control">
                    7
                </div>
            </div>
            <div class="col-3">
                <div id="chatbot-control-4" class="chatbot-control">
                    8
                </div>
            </div>
            <div class="col-3">
                <div id="chatbot-control-4" class="chatbot-control">
                    9
                </div>
            </div>
            <div class="col-3">
                <div id="chatbot-control-4" class="chatbot-control">
                    10
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div id="chatbot-control-3" class="chatbot-control">
                    11
                </div>
            </div>
        </div>
    </div>
`
        this.add_css_rules(css_rules)
        styles = '<link href="../../../lib/bootstrap.min.css"     rel="stylesheet">'
        //const html_data = styles + container
        const html_data = styles + container
        const target_div = this.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = html_data
        console.log('here')
    }
}