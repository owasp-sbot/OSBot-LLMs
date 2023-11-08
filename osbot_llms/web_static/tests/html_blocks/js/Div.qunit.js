import Div, {div_create_box} from '../../../src/html_blocks/js/Div.js';
import Html_Tag from '../../../src/html_blocks/js/Html_Tag.js';

QUnit.module('Div', function(hooks) {

    hooks.before(function (assert) {
        //window.Div = Div                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    // working test (which is the only work that works in real-time in Wallaby)

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const divInstance = new Div()
        assert.ok(divInstance instanceof Html_Tag, 'Div is an instance of Html_Tag');
        assert.ok(Div.prototype instanceof Html_Tag, 'Div.prototype is an instance of Html_Tag');
  });


    QUnit.test('.Create and show div on QUnit page', function (assert) {
        const div = div_create_box()
        //div.dom_element().html('Div - Create and show div on QUnit page')
        const expected_html = `<div id="${div.id}" style="border: 10px solid blue; bottom: 40px; left: 40px; position: absolute; right: 40px; top: 40px;">\n</div>\n`
        const actual_html = div.html()
        assert.equal(actual_html, expected_html, "html matches expected")
    })

})


        // window.tag_create_box = tag_create_box
        // const box = tag_create_box('an_box', "70")
        // box.set_style('border', '10px solid red')
        // box.add_to_dom_element(document.body);
        //
        // box.add_element(tag)
        // console.log(box.html())