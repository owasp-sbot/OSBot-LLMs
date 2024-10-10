import Div from "../Div.js";

export function div_box({id=null, margin=40, border='5px solid blue'}={})  {
    const div = new Div({id:id})
    div.set_styles({'top'    : `${margin}px`   ,
                    'bottom' : `${margin}px`   ,
                    'right'  : `${margin}px`   ,
                    'left'   : `${margin}px`   ,
                    'border' : border          ,
                    'position': 'absolute'     })
    div.dom_add()
    return div
}