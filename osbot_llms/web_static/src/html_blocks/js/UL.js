import Tag  from './Tag.js'
import Text from './Text.js'

export default class UL extends Tag {
    constructor({...kwargs}={}) {
        super({tag:'ul',...kwargs})
//        this.list_items = []
    }

    // todo: move this to an options Tag (which is the one that uses this technique
    // add_li({key,value, text}) {
    //     const item = {key,value, text}
    //     const li_element = this.create_li(item)
    //
    //     this.list_items.push(item)
    //     this.add_element(li_element)
    //     return this
    // }
    //
    // create_li({key,value, text}) {
    //     const li = new Text({tag:'li', text:text, attributes:{key,value} })
    //     return li
    // }
}