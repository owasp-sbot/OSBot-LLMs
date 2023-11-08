import Html_Tag from './Html_Tag.js'

export default class B extends Html_Tag {
    constructor({id = null}={}) {
        super({tag_name:'b', id:id});
    }
}