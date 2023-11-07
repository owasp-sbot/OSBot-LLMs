import Div, {div_create_box} from '../../../src/html_blocks/js/Div.js';

QUnit.module('Div', function(hooks) {

    hooks.before(function (assert) {
        window.Div = Div
    })

    // working test (which is the only work that works in real-time in Wallaby)
    QUnit.test('Div - add_element', function (assert) {
        const div = new Div('parent')                                             // parent div
        const div_child_1 = new Div('child_1')                                            // add a div to the parent div
        const expected_inner_html_1 =
`    <div id="child_1">
    </div>
`
        const expected_html_1 =
`<div id="parent">
    <div id="child_1">
    </div>
</div>
`
        div.add_element(div_child_1)
        assert.propEqual(div.elements, [div_child_1])
        assert.equal(div.inner_html(), expected_inner_html_1)
        assert.equal(div.html(), expected_html_1)


        const div_child_2 = new Div('child_2')                                           // add another div to the parent div
        const expected_inner_html_2 =
`    <div id="child_1">
    </div>
    <div id="child_2">
    </div>
`
        const expected_html_2 =
`<div id="parent">
    <div id="child_1">
    </div>
    <div id="child_2">
    </div>
</div>
`
        div.add_element(div_child_2)
        assert.propEqual(div.elements, [div_child_1, div_child_2])
        assert.equal(div.inner_html(), expected_inner_html_2)
        assert.equal(div.html(), expected_html_2)

        const div_child_3 = new Div('child_3')                                            // add another div to the parent div
        const expected_inner_html_3 =
`    <div id="child_1">
        <div id="child_3">
        </div>
    </div>
    <div id="child_2">
    </div>
`
const expected_html_3 =
`<div id="parent">
    <div id="child_1">
        <div id="child_3">
        </div>
    </div>
    <div id="child_2">
    </div>
</div>
`

        div_child_1.add_element(div_child_3)
        assert.propEqual(div.elements, [div_child_1, div_child_2])
        assert.propEqual(div_child_1.elements, [div_child_3])
        assert.equal(div.inner_html(), expected_inner_html_3)
        assert.equal(div.html(),expected_html_3)

        const div_child_4 = new Div('child_4')                                            // add a child div to the last child div
        const expected_inner_html_4 =
`    <div id="child_1">
        <div id="child_3">
            <div id="child_4">
            </div>
        </div>
    </div>
    <div id="child_2">
    </div>
`
        const expected_html_4 =
`<div id="parent">
    <div id="child_1">
        <div id="child_3">
            <div id="child_4">
            </div>
        </div>
    </div>
    <div id="child_2">
    </div>
</div>
`
        div_child_3.add_element(div_child_4)
        assert.propEqual(div.elements, [div_child_1, div_child_2])
        assert.propEqual(div_child_1.elements, [div_child_3])
        assert.propEqual(div_child_3.elements, [div_child_4])
        assert.equal(div.inner_html(), expected_inner_html_4)
        assert.equal(div.html(),expected_html_4)


        // window.div_create_box = div_create_box
        // const box = div_create_box('an_box', "70")
        // box.set_style('border', '10px solid red')
        // box.add_to_dom_element(document.body);
        //
        // box.add_element(div)
        // console.log(box.html())
    })

    QUnit.test('Div - Create and show div on QUnit page', function (assert) {
        const div = div_create_box()
        //div.dom_element().html('Div - Create and show div on QUnit page')
        const expected_html = `<div id="${div.id}" style="border: 10px solid blue; bottom: 40px; left: 40px; position: absolute; right: 40px; top: 40px;">\n</div>\n`
        const actual_html = div.html()
        assert.equal(actual_html, expected_html, "html matches expected")
    })

    QUnit.test('Div.add_to', function (assert) {
        const div_id = 'an_id'
        const target = $(`<div id='${div_id}'>`)[0]                                     // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal(target.outerHTML, `<div id="${div_id}"></div>`)

        assert.equal($(`#${div_id}`).html(), undefined, `${div_id} is undefined`)
        $(`<div id='${div_id}'>`).appendTo('body')                                      // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${div_id}`).html(), ''       , `${div_id} is an empty string`)
        const div = new Div('an_div');
        div.set_style('top', '10px');
        div.set_style('border', '2px solid');
        const expectedHtml = '<div id="an_div" style="border: 2px solid; top: 10px;">\n</div>\n';        // Expected HTML result

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
        let expected_html = `<div id="${div.id}" style="${expected_styles}">\n</div>\n`;

        const actual_html = div.html();
        assert.equal(actual_html, expected_html, "Html generated with all attributes matches the expected output");
    })

    QUnit.test('Div.constructor', function (assert) {
        const div           = new Div()
        const random_id     = div.id
        const expected_html = `<div id="${random_id}">\n</div>\n`

        assert.ok(div instanceof Div)
        assert.equal(div.tag_name, 'div')
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

        assert.equal(div.html(),expected_html)
    });

    QUnit.test('Div.set_value', function (assert) {
        const div       =   new Div()
        const div_styles = div.styles
        div.set_style('top', '10px')
        assert.equal(div_styles.top, '10px')
    })
})