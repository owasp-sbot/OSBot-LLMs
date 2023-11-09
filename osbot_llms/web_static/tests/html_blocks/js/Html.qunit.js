import Html from '../../../src/html_blocks/js/Html.js';
import Tag  from '../../../src/html_blocks/js/Tag.js' ;

QUnit.module('Html', function(hooks) {

    QUnit.test('.constructor',  function (assert) {
        const html_1 = new Html();
        assert.equal(html_1.tag  , 'html')
        assert.equal(html_1.value, ''    )
        assert.equal(html_1.class, null  )
        assert.ok   (html_1.id.includes('html_'))
        const html_2 = new Html({id:'an_id', 'class':'an_class'});
        assert.equal(html_2.tag  , 'html'    )
        assert.equal(html_2.value, ''        )
        assert.equal(html_2.id   , 'an_id'   )
        assert.equal(html_2.class, 'an_class')
    })

    QUnit.test('.add_element',  function (assert) {
        const html = new Html();
        assert.equal(html.add_element(), false)
    })

    QUnit.test('.html',  function (assert) {
        const html = new Html();
        const expected_html_1 =
`<html id="${html.id}">
</html>
`
        assert.equal(html.html(), expected_html_1)
        const value_1 = '<b>an<i>html</i> is here</b>'
        html.value = value_1
        const expected_html_2 =
`<html id="${html.id}">
${html.value}
</html>
`
        assert.equal(html.html(), expected_html_2)
    })

    QUnit.test('_should be an instance and inherit from Tag', function(assert) {
        const html = new Html();
        assert.ok(html instanceof Tag, 'Div is an instance of Tag');
        assert.ok(Html.prototype instanceof Tag, '.prototype is an instance of Tag');
        assert.equal(html.tag, 'html');
    });
})