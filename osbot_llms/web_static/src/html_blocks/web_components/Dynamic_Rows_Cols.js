import Web_Component from "./Web_Component.js";
import Div           from "../js/Div.js";

export default class Dynamic_Rows_Cols extends Web_Component {
    constructor() {
        super();
    }

create_target_div() {
    const css_rules = {     ".right-div": {
                                border:             "3px solid blue",
                                bottom:             "120px",
                                overflow:           "auto",
                                position:           "fixed",
                                right:              "60px",
                                top:                "60px",
                                width:              "50%",
                                "z-index":          "1000",
                                backgroundColor:    "white"
                            },
                            ".container-full-height": {
                                display:            "flex",
                                "flex-direction":   "column",
                                height:             "100%",
                                padding:            "0"
                            },
                            ".flex-row": {
                                flex:               "1",
                                display:            "flex"
                            },
                            ".flex-col": {
                                flex:               "1",
                                display:            "flex",
                                padding:            "0"
                            },
                            ".content-center": {
                                border:             "3px solid red",
                                "flex-grow":        "1",
                                display:            "flex",
                                "justify-content":  "center",
                                "align-items":      "center"
                            }
                        };


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

        const div_container   = new Div({id:'container_div', class:'container-full-height'})
        const row_1           = new Div({class:'flex-row'})
        const row_1_col_1     = new Div({class:'flex-col'})
        const row_1_col_1_div = new Div({class:'content-center'})
        const row_1_col_2     = new Div({class:'flex-col'})
        const row_1_col_2_div = new Div({class:'content-center'})


        div_container.add(row_1)
        row_1        .add(row_1_col_1)
        row_1_col_1  .add(row_1_col_1_div)
        row_1_col_1_div.add_text('1').just_text()

        row_1        .add(row_1_col_2)
        row_1_col_2  .add(row_1_col_2_div)
        row_1_col_2_div.add_text('2').just_text()

        // row 2
        div_container
            .add_div({class:'flex-row'})
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('3').parent().parent().parent()
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('4')

        // row 3
        div_container
            .add_div({class:'flex-row'})
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('5').parent().parent().parent()
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('6').parent().parent().parent()
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('7')

        // row 4
        div_container
            .add_div({class:'flex-row'})
            .add_div({class:'flex-col'})
            .add_div({class:'content-center'})
            .add_text('8')

        return div_container
    }
}