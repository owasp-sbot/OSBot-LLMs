import Div from '../../../src/html_blocks/js/Div.js';

QUnit.module('Div', function(hooks) {

    hooks.before(function (assert) {
        window.Div = Div
        //this.div = new QUnit_Utils()
    })

    // working test (which is the only work that works in real-time in Wallaby)
    QUnit.test('Div.add_to', function (assert) {
        const div_id = 'an_id'
        const target = $(`<div id='${div_id}'>`)[0]                                     // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal(target.outerHTML, `<div id="${div_id}"></div>`)

        assert.equal($(`#${div_id}`).html(), undefined, `${div_id} is undefined`)
        $(`<div id='${div_id}'>`).appendTo('body')                                      // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${div_id}`).html(), ''       , `${div_id} is an empty string`)
        const div = new Div();
        div.set_style('top', '10px');
        div.set_style('border', '2px solid');
        const expectedHtml = '<div style="border: 2px solid; top: 10px;"></div>';        // Expected HTML result

        div.add_to(`#${div_id}`);
        const actualHtml = $(`#${div_id}`).html()                                       // Get the value of the id from the DOM
        assert.strictEqual(actualHtml, expectedHtml, "The div's HTML should match the expected HTML and be appended to the body");   // Test whether the div was added to the fixture

        // Clean up by removing the added div
        $(`#${div_id}`).remove()                                                        // todo: remove jQuery dependency (once Div API is more mature)
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
})