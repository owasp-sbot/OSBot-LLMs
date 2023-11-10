import Text  from '../../../src/html_blocks/js/Text.js';
import Tag from '../../../src/html_blocks/js/Tag.js';

QUnit.module('Text', function(hooks) {

    hooks.before(function (assert) {
        //window.Div = Div                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    QUnit.test('.config',  function (assert) {
        const text = new Text();
        const expected_html_config = {  include_id              : true  ,
                                        include_tag             : true  ,
                                        indent_before_last_tag  : false  ,
                                        new_line_before_elements: false ,
		                                new_line_after_final_tag: false ,
                                        trim_final_html_code    : false }
        assert.propEqual(text.html_config, expected_html_config)
    })

    QUnit.test('.add_element',  function (assert) {
        const text = new Text();
        assert.equal(text.add_element(), false)
    })

    QUnit.test('.html',  function (assert) {
        const text = new Text();
        const expected_html_1 = `<text id="${text.id}"></text>`
        assert.equal(text.html(), expected_html_1)
        const value_1 = 'aaaa'
        text.value = value_1
        const expected_html_2 = `<text id="${text.id}">${text.value}</text>`
        assert.equal(text.html(), expected_html_2)
    })

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const text = new Text();
        assert.ok(text instanceof Tag, 'Div is an instance of Html_Tag');
        assert.ok(Text.prototype instanceof Tag, '.prototype is an instance of Html_Tag');
        assert.equal(text.tag, 'text');
    });
})