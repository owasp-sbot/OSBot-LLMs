

export class QUnit_Utils {

    constructor() {
        // Initialization code here
        //console.log('QUnit_Utils instance created');
    }
    ping() {
        return 'pong'
    }

    create_div() {
        // Create the div with the id 'html_block' and class 'right-div'
        var $div = $('<div>', { id: 'html_block', class: 'right-div' });
        var margin = 30
        var top    = margin
        var bottom = margin
        var left   = margin
        var right  = margin
        // Apply the CSS styles to the div
        var css_attrs = {
            'background-color': 'white',
            'border': '3px solid blue',
            'bottom': `${bottom}px`,
            'overflow': 'auto',
            'padding': '0',
            'position': 'fixed',
            //'left'    : `${left}px`,
            'right'   : `${right}px`,
            'top': `${top}px`,
             'width': '30%',
            'z-index': '1000'
        }
        $div.css(css_attrs);

        // Append the div to the body of the document
        $('body').append($div);
        return $div
    }
}