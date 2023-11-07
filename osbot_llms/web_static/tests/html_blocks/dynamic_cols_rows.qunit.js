import {Div, QUnit_Utils} from './QUnit_Utils.js';

QUnit.module('dynamic_cols_rows.html', function(hooks) {

    hooks.before(function (assert) {
        this.qunit_utils = new QUnit_Utils()
        window.Div = Div
        //this.div = new QUnit_Utils()
    })

    // working test (which is the only work that works in real-time in Wallaby)
    QUnit.test('Div.add_to', function (assert) {
        const div_id = 'an_id'
        const target = $(`<div id='${div_id}'>`)[0]
        assert.equal(target.outerHTML, `<div id="${div_id}"></div>`)
        console.log(document.body.insertAdjacentHTML('beforeend', target.outerHTML))


        const div = new Div();
        div.set_style('top', '10px');
        div.set_style('border', '2px solid');
        const expectedHtml = '<div style="border: 2px solid; top: 10px;"></div>';        // Expected HTML result

        assert.equal($(`#${div_id}`).html(), '')
        div.add_to(`#${div_id}`);

        const actualHtml = $(`#${div_id}`).html()                                       // Get the value of the id from the DOM
        console.log(actualHtml)
        assert.strictEqual(actualHtml, expectedHtml, "The div's HTML should match the expected HTML and be appended to the body");   // Test whether the div was added to the fixture

        // Clean up by removing the added div
        $(`#${div_id}`).remove()

        assert.equal($(`#${div_id}`).html(), undefined)
    });

    QUnit.test('Div.default_styles()',  function (assert) {
        const div = new Div();

        const random_styles = {};                                                          // Generate random values for attributes and set them
        Object.keys(div.default_styles()).forEach((attr) => {
            random_styles[attr] = Math.random().toString(36).substring(2, 15);       // Generate a random string for each attribute
        });
        div.set_styles(random_styles)

        let expected_styles = ""
        for (let [attr, value] of Object.entries(random_styles)) {
            expected_styles += `${attr}: ${value}; `;
        }
        expected_styles = expected_styles.trim()
        let expected_html = `<Div style="${expected_styles}"></Div>`;

        const actual_html = div.html();
        assert.equal(actual_html, expected_html, "Html generated with all attributes matches the expected output");
    })

    QUnit.test('Div.constructor', function (assert) {
        const div = new Div()
        assert.ok(div instanceof Div)
        assert.equal(div.tag_name, 'Div')
        assert.propEqual(div.styles, { background_color: null,
                                       border          : null,
                                       bottom          : null,
                                       left            : null,
                                       margin          : null,
                                       overflow        : null,
                                       padding         : null,
                                       position        : null,
                                       right           : null,
                                       top             : null,
                                       width           : null,
                                       z_index         : null})

        assert.equal(div.html(),'<Div></Div>')
    });

    QUnit.test('Div.set_value', function (assert) {
        const div       =   new Div()
        const div_styles = div.styles
        div.set_style('top', '10px')
        assert.equal(div_styles.top, '10px')
    })


    QUnit.test('QUnit_Utils', function (assert) {
        assert.equal(this.qunit_utils.ping(), 'pong')
        assert.equal(QUnit_Utils.prototype.constructor,QUnit_Utils, 'QUnit_Utils.prototype.constructor')
        assert.ok(this.qunit_utils instanceof QUnit_Utils         , "this.qunit_utils instanceof QUnit_Utils")
        const $div = this.qunit_utils.create_div()
        console.log($div)
    })
})