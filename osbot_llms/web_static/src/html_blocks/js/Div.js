import Html_Tag from './Html_Tag.js'

export default class Div extends Html_Tag {
    constructor(id=null) {
        super('div', id);
        //this.styles     = this.default_styles()
        //this.tag_name   = 'div'
        //this.id         = id || this.generate_random_id();
        //this.elements   = []
    }






}

export function div_create_box(id=null, margin=40, border='10px solid blue')  {
    const div = new Div(id)
    div.set_styles({'top'    : `${margin}px`   ,
                    'bottom' : `${margin}px`   ,
                    'right'  : `${margin}px`   ,
                    'left'   : `${margin}px`   ,
                    'border' : border          ,
                    'position': 'absolute'     })

    //div.add_to_dom_element(document.body);
    return div
    //console.log(document.body.innerHTML)
}