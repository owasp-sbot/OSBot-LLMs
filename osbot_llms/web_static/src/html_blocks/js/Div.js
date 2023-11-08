import Tag from './Tag.js'

export default class Div extends Tag {
    constructor({id=null}={}) {
        super({tag:'div', id:id });
    }
}