import B  from '../../../src/html_blocks/js/B.js';
import Tag from '../../../src/html_blocks/js/Tag.js';

QUnit.module('B', function(hooks) {

    hooks.before(function (assert) {
        //window.Div = Div                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    // working test (which is the only work that works in real-time in Wallaby)

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const b = new B();
        assert.ok(b instanceof Tag, 'Div is an instance of Html_Tag');
        assert.ok(B.prototype instanceof Tag, 'Div.prototype is an instance of Html_Tag');
        assert.equal(b.tag, 'b');
  });


    QUnit.test('.html',  function (assert) {
        const b = new B();
        const expected_html = `<b id="${b.id}">\n</b>\n`
        assert.equal(b.html(), expected_html)

    })

})


        // window.tag_create_box = tag_create_box
        // const box = tag_create_box('an_box', "70")
        // box.set_style('border', '10px solid red')
        // box.add_to_dom_element(document.body);
        //
        // box.add_element(tag)
        // console.log(box.html())