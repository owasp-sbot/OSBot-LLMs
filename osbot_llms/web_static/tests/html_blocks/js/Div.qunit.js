import Div from '../../../src/html_blocks/js/Div.js';
import Tag from '../../../src/html_blocks/js/Tag.js';

QUnit.module('Div', function(hooks) {

    hooks.before(function (assert) {
        //window.Div = Div                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    // working test (which is the only work that works in real-time in Wallaby)

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const divInstance = new Div()
        assert.ok(divInstance instanceof Tag, 'Div is an instance of Html_Tag');
        assert.ok(Div.prototype instanceof Tag, 'Div.prototype is an instance of Html_Tag');
    });

    QUnit.test('.dom , dom_add',  function (assert) {
        const margin = 40
        const border = '10px solid blue'
        const div = new Div()
        div.set_styles({'top'    : `${margin}px`   ,
                        'bottom' : `${margin}px`   ,
                        'right'  : `${margin}px`   ,
                        'left'   : `${margin}px`   ,
                        'border' : border          ,
                        'position': 'absolute'     })

        const expected_html = `<div id="${div.id}" style="border: 10px solid blue; bottom: 40px; left: 40px; position: absolute; right: 40px; top: 40px;">\n</div>\n`
        const actual_html = div.html()
        assert.equal(actual_html, expected_html, "html matches expected")
        assert.equal(document.querySelectorAll('#'+div.id).length, 0, "there are no divs with div.id on the page")
        assert.equal(div.dom_add(), true , "adding once should work" )
        assert.equal(div.dom_add(), false, "adding again should fail")
        assert.equal(div.parent_id, null)
        assert.equal(div.parent_dom, document.body)
        assert.equal(document.querySelectorAll('#'+div.id).length, 1, "the div.id is now on the page")
        assert.equal(div.dom(), document.getElementById(div.id))
        assert.equal(div.dom_remove(), true)
        assert.equal(div.dom_remove(), false)
        assert.equal(document.querySelectorAll('#'+div.id).length, 0, "after remove the div.id is not on the page")
    })

})


        // window.tag_create_box = tag_create_box
        // const box = tag_create_box('an_box', "70")
        // box.set_style('border', '10px solid red')
        // box.add_to_dom_element(document.body);
        //
        // box.add_element(tag)
        // console.log(box.html())