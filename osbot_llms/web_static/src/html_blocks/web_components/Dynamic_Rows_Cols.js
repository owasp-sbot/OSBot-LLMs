import Web_Component from "./Web_Component.js";
import Div           from "../js/Div.js";

export default class Dynamic_Rows_Cols extends Web_Component {
    constructor() {
        super();
    }

    create_target_div () {
        const css_rules = { ".right-div"        : { "background-color": "white"         , /* Background color                                       */
                                                    border           : "3px solid blue", /* Blue border with a thickness of 3px                    */
                                                    bottom           : "120px"         , /* Space from the bottom                                  */
                                                    overflow         : "auto"          , /* Enables scrollbars if content overflows                */
                                                    padding          : "0"             , /* Padding inside the div, if needed                      */
                                                    position         : "fixed"         , /* Fix the div to the right side of the screen            */
                                                    right            : "60px"          , /* Space from the right                                   */
                                                    top              : "60px"          , /* Space from the top                                     */
                                                    width            : "50%"           , /* Occupy 50% of the screen width                         */
                                                    "z-index"        : "1000"          },/* High z-index to ensure it's in front of other elements */

                            ".container-fluid"  : { "min-height"    : "100%",
                                "height": "100%",
                                                    display         : "flex",
                                                    "flex-direction": "column",
                                                    padding         : "0" },
                            ".row": {               flex            : "1",
                                                    display         : "flex",
                                                    margin          : "0"},
                            ".col-1, .col-2, .col-3, .col-4, .col-6, .col-8, .col-9, .col-12": {
                                                    //flex            : "1",
                                                    display         : "flex",
                                                    padding         : "0"        },
                            ".chatbot-control"  : { border          : "3px solid red",
                                                    "flex-grow"     : "1",
                                                    margin          : "0px",
                                                    display         : "flex",
                                                    "justify-content": "center",
                                                    "align-items"   : "center"}
        }
        this.add_css_rules(css_rules)
        this.set_inner_html('<div id="html_block" class="right-div">...content..</div>')
    }


    build() {
        const container_div = this.create_container_div()
        const container_html     = container_div.html()
        const target_div = this.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = container_html
    }

    create_container_div () {

        const div_container   = new Div({id:'container_div', class:'container-fluid'})
        const row_1           = new Div({class:'row'})
        const row_1_col_1     = new Div({class:'col-4'})
        const row_1_col_1_div = new Div({class:'chatbot-control'})
        const row_1_col_2     = new Div({class:'col-8'})
        const row_1_col_2_div = new Div({class:'chatbot-control'})


        div_container.add(row_1)
        row_1        .add(row_1_col_1)
        row_1_col_1  .add(row_1_col_1_div)
        row_1_col_1_div.add_text('1').just_text()

        row_1        .add(row_1_col_2)
        row_1_col_2  .add(row_1_col_2_div)
        row_1_col_2_div.add_text('2').just_text()

        // row 2
        div_container
            .add_div({class:'row'})
            .add_div({class:'col-6'})
            .add_div({class:'chatbot-control'})
            .add_text('3').parent().parent().parent()
            .add_div({class:'col-6'})
            .add_div({class:'chatbot-control'})
            .add_text('4')

        // row 3
        div_container
            .add_div({class:'row'})
            .add_div({class:'col-1'})
            .add_div({class:'chatbot-control'})
            .add_text('5').parent().parent().parent()
            .add_div({class:'col-2'})
            .add_div({class:'chatbot-control'})
            .add_text('6').parent().parent().parent()
            .add_div({class:'col-9'})
            .add_div({class:'chatbot-control'})
            .add_text('7')

        // row 4
        div_container
            .add_div({class:'row'})
            .add_div({class:'col-12'})
            .add_div({class:'chatbot-control'})
            .add_text('8')

        return div_container
    }
    async load_bootstrap() {
        const path = "../../../lib/bootstrap.min.css"
        const css_code = await fetch(path)
                                .then(res => res.text())
                                .then(data => { return data} )
        const style = document.createElement('style');
        style.textContent = css_code;
        this.shadowRoot.appendChild(style);
        return 'ok'
    }
}