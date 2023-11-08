import Html_Tag from './Html_Tag.js'

export default class Text extends Html_Tag {
    constructor({id = null, value=''}={}) {
        super({tag_name:'text', id:id});
        this.value = value
        this.config()
    }

    config() {
        this.html_config.new_line_before_elements = false
        this.html_config.new_line_after_final_tag = false
    }

    add_element(element) {              // text elements should NOT have any child elements
        return false                    // return false to indicate that the element was not added
    }

    inner_html() {
        return this.value               // inner_html for text elements is always a string
    }
}