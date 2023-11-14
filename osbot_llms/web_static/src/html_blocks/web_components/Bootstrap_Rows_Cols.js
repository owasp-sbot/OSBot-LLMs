import Web_Component from "./Web_Component.js";
import Div           from "../js/Div.js";

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
        
        const container_div = this.create_container_div()
        const container_2 = container_div.html()
        this.add_css_rules(css_rules)
        const html_data =  container_2
        const target_div = this.shadowRoot.querySelector('.right-div')
        target_div.innerHTML = html_data
        console.log('here')
    }

    create_container_div () {

        const div_container   = new Div({id:'container_div', class:'container-fluid'})
        const row_1           = new Div({class:'row'})
        const row_1_col_1     = new Div({class:'col-6'})
        const row_1_col_1_div = new Div({class:'chatbot-control'})
        const row_1_col_2     = new Div({class:'col-6'})
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
            .add_div({class:'col-4'})
            .add_div({class:'chatbot-control'})
            .add_text('5').parent().parent().parent()
            .add_div({class:'col-4'})
            .add_div({class:'chatbot-control'})
            .add_text('6').parent().parent().parent()
            .add_div({class:'col-4'})
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