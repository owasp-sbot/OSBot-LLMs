import UL  from '../../../src/html_blocks/js/UL.js';
import Tag from '../../../src/html_blocks/js/Tag.js';

QUnit.module('UL', function(hooks) {

    hooks.before(function (assert) {
        //window.Div = Div                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    QUnit.test('.constructor', function(assert) {
        const ul_1 = new UL()
        assert.equal(ul_1.tag, 'ul')
        assert.equal(ul_1.html(), `<ul id="${ul_1.id}">\n</ul>\n`)
        const ul_2 = new UL({id:'an_id', class:'an_class'})
        assert.equal(ul_2.html(), '<ul id="an_id" class="an_class">\n</ul>\n')
    })

    QUnit.test('.add_li', function(assert) {
        const ul = new UL()
        const kwargs = { key:'1_key__', value:'value__', text:'text__'}
        const expected_line_items = [ { key: '1_key__', value: 'value__', text: 'text__' },
                                      { key: '2_aaaaaa', value: 'value__', text: 'text__' },
                                      { key: '2_aaaaaa', value: 'value__', text: 'text__' },
                                      { key: '4_bbbbbb', value: 'value__', text: 'text__' } ]
        ul.add_li(kwargs)
        kwargs.key = '2_aaaaaa'
        ul.add_li(kwargs)
          .add_li(kwargs)
        kwargs.key = '4_bbbbbb'
        ul.add_li(kwargs)

        assert.propEqual(ul.list_items, expected_line_items)
        //assert.expect(0)
    })

    QUnit.test('.inner_html', function(assert) {
        const ul     = new UL()
        const kwargs = { key:'an_key', value:'an_value', text:'an_text'}
        ul.add_li(kwargs)

        console.log(ul.inner_html())
        assert.expect(0)
    })

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const ul = new UL()
        assert.ok(ul instanceof Tag, 'UL is an instance of Tag');
        assert.ok(UL.prototype instanceof Tag, 'UL.prototype is an instance of Html_Tag');
    });
})


