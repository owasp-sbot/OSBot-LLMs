import Tag from './Tag.js'

export default class B extends Tag {
    constructor({id = null}={}) {
        super({tag:'b', id:id});
    }
}