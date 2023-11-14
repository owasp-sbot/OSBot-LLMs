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
}