import Tag from './Tag.js'

export default class Div extends Tag {
    constructor({id=null}={}) {
        super({tag:'div', id:id });
    }
}

// todo: move this into a components section as (for example) "Div_Box" component
export function div_create_box(id=null, margin=40, border='10px solid blue')  {
    const div = new Div({id:id})
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