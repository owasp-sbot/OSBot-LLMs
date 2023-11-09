import H  from '../../../src/html_blocks/js/H.js';
import Tag from '../../../src/html_blocks/js/Tag.js';

QUnit.module('H', function(hooks) {


    QUnit.test('.constructor',  function (assert) {
        assert.equal(new H().tag, 'h1')
        assert.equal(new H({level:1}).tag, 'h1')
        assert.equal(new H({level:2}).tag, 'h2')
        assert.equal(new H({level:3}).tag, 'h3')

        assert.equal(new H({level:'A'}).tag, 'hA')          // todo: this is a bug, only h1 .. h6 values should be accepted
    })


    QUnit.test('.html',  function (assert) {
        const h1 = new H();
        assert.equal(h1.html(), `<h1 id="${h1.id}"></h1>\n`)

        const h2 = new H({level:2, value:'abc'});
        assert.equal(h2.html(), `<h2 id="${h2.id}">abc</h2>\n`)
    })

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const h = new H();
        assert.ok(h instanceof Tag, 'Div is an instance of Html_Tag');
        assert.ok(H.prototype instanceof Tag, 'Div.prototype is an instance of Html_Tag');
        assert.equal(h.tag, 'h1');
  });
})
