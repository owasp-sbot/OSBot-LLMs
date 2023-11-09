import Html from '../../../src/html_blocks/js/Html.js';
import Tag  from '../../../src/html_blocks/js/Tag.js' ;

QUnit.module('Html', function(hooks) {

    QUnit.test('.constructor',  function (assert) {
        const html_1 = new Html();
        assert.equal(html_1.tag  , 'html')
        assert.equal(html_1.value, ''    )
        assert.equal(html_1.class, null  )
        assert.ok   (html_1.id.includes('html_'))
        assert.equal(html_1.html_config.include_tag, false)
        const html_2 = new Html({id:'an_id', 'class':'an_class'});
        assert.equal(html_2.tag  , 'html'    )
        assert.equal(html_2.value, ''        )
        assert.equal(html_2.id   , 'an_id'   )
        assert.equal(html_2.class, 'an_class')

    })

    QUnit.test('.config',  function (assert) {
        const html = new Html();
        const expected_html_config = {  include_tag             : false ,
                                        new_line_before_elements: true ,
		                                new_line_after_final_tag: true ,
                                        trim_final_html_code    : true  }
        assert.propEqual(html.html_config, expected_html_config)
    })

    QUnit.test('.add_element',  function (assert) {
        const html = new Html();
        assert.equal(html.add_element(), false)
    })

    QUnit.test('.html',  function (assert) {
        const html_1 = new Html();                                          // .html() use case 1
        assert.equal(html_1.html_config.include_tag, false, 'html_config.include_tag defaults to false')
        const expected_html_1 = ''
        assert.equal(html_1.html(), expected_html_1)

        const html_2  = new Html();                                         // .html() use case 2
        const value_1 = '<b>an<i>html</i> is here</b>'
        assert.equal(html_1.html_config.include_tag, false, 'html_config.include_tag defaults to false')
        html_1.value = value_1
        const expected_html_2 = `${html_2.value}`
        assert.equal(html_2.html(), expected_html_2)

        const html_3 = new Html();                                          // .html() use case 3
        html_3.html_config.include_tag = true
        assert.equal(html_3.html_config.include_tag, true)
        const expected_html_3 =
`<html id="${html_3.id}">
</html>`
        assert.equal(html_3.html(), expected_html_3)

        const html_4  = new Html();                                         // .html() use case 4
        const value_2 = '<b>an<i>html</i> is here</b>'
        html_4.html_config.include_tag = true
        html_4.value = value_2
        assert.equal(html_4.html_config.include_tag, true)
        const expected_html_4 =
`<html id="${html_4.id}">
${html_4.value}
</html>`
        assert.equal(html_4.html(), expected_html_4)
    })

    QUnit.test('_should be an instance and inherit from Tag', function(assert) {
        const html = new Html();
        assert.ok(html instanceof Tag, 'Div is an instance of Tag');
        assert.ok(Html.prototype instanceof Tag, '.prototype is an instance of Tag');
        assert.equal(html.tag, 'html');
    });
})