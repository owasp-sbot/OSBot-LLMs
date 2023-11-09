import Tag from './Tag.js'

export default class Html extends Tag {
    constructor({value='', ...kwargs}={}) {
        super({tag: 'html', ...kwargs});
        this.value = value
    }

    add_element(element) {              // html elements should NOT have any child elements
        return false                    // return false to indicate that the element was not added
    }

    inner_html() {
        console.log(this.value==='')
        if (this.value === '') {
            return ''
        }
        else {
            return this.value +'\n'         // inner_html for html elements is always a string (which returns the raw html)
        }


    }
}