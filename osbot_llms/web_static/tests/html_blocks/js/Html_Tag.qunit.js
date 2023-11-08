import Html_Tag from "../../../src/html_blocks/js/Html_Tag.js";

QUnit.module('Html_Tag', function(hooks) {

    hooks.before(function (assert) {
        //window.Html_Tag = Html_Tag                                    // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    QUnit.test('.constructor', function (assert) {
        const tag           = new Html_Tag()
        const random_id     = tag.id
        const expected_html = `<tag id="${random_id}">\n</tag>\n`

        assert.equal(tag.tag_name, 'tag')
        assert.ok(tag.id.startsWith('tag_'), 'tag.id should start with "tag_"');
        assert.ok(tag instanceof Html_Tag)
        assert.equal(tag.tag_name, 'tag')
        assert.propEqual(tag.styles, { background_color: null,
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
        assert.propEqual(tag.html_config, { new_line_before_elements: true,
                                            new_line_after_final_tag: true})
        assert.equal(tag.html(),expected_html)
    });

    QUnit.test('.add_element', function (assert) {
        const tag_id         = 'parent'
        const tag_child_1_id = 'child_1'
        const tag            = new Html_Tag({id: tag_id         })                                    // parent div
        const tag_child_1    = new Html_Tag({id: tag_child_1_id })                                    // add a div to the parent div
        const expected_inner_html_1 =
`    <tag id="child_1">
    </tag>
`
        const expected_html_1 =
`<tag id="parent">
    <tag id="child_1">
    </tag>
</tag>
`
        assert.equal(tag.tag_name        , 'tag'         )
        assert.equal(tag_child_1.tag_name, 'tag'         )
        assert.equal(tag.id              , tag_id        )
        assert.equal(tag_child_1.id      , tag_child_1_id)

        tag.add_element(tag_child_1)
        assert.propEqual(tag.elements, [tag_child_1])
        console.log(expected_inner_html_1)
        console.log(tag.inner_html())
        assert.equal(tag.inner_html(), expected_inner_html_1)
        assert.equal(tag.html(), expected_html_1)

        const tag_child_2 = new Html_Tag({tag_name:'tag', id:'child_2'})                                           // add another tag to the parent tag
        const expected_inner_html_2 =
`    <tag id="child_1">
    </tag>
    <tag id="child_2">
    </tag>
`
        const expected_html_2 =
`<tag id="parent">
    <tag id="child_1">
    </tag>
    <tag id="child_2">
    </tag>
</tag>
`
        tag.add_element(tag_child_2)
        assert.propEqual(tag.elements, [tag_child_1, tag_child_2])
        assert.equal(tag.inner_html(), expected_inner_html_2)
        assert.equal(tag.html(), expected_html_2)

        const tag_child_3 = new Html_Tag({tag_name:'tag',id:'child_3'})                                            // add another tag to the parent tag
        const expected_inner_html_3 =
`    <tag id="child_1">
        <tag id="child_3">
        </tag>
    </tag>
    <tag id="child_2">
    </tag>
`
const expected_html_3 =
`<tag id="parent">
    <tag id="child_1">
        <tag id="child_3">
        </tag>
    </tag>
    <tag id="child_2">
    </tag>
</tag>
`

        tag_child_1.add_element(tag_child_3)
        assert.propEqual(tag.elements, [tag_child_1, tag_child_2])
        assert.propEqual(tag_child_1.elements, [tag_child_3])
        assert.equal(tag.inner_html(), expected_inner_html_3)
        assert.equal(tag.html(),expected_html_3)

        const tag_child_4 = new Html_Tag({tag_name:'tag',id:'child_4'})                                            // add a child tag to the last child tag
        const expected_inner_html_4 =
`    <tag id="child_1">
        <tag id="child_3">
            <tag id="child_4">
            </tag>
        </tag>
    </tag>
    <tag id="child_2">
    </tag>
`
        const expected_html_4 =
`<tag id="parent">
    <tag id="child_1">
        <tag id="child_3">
            <tag id="child_4">
            </tag>
        </tag>
    </tag>
    <tag id="child_2">
    </tag>
</tag>
`
        tag_child_3.add_element(tag_child_4)
        assert.propEqual(tag.elements, [tag_child_1, tag_child_2])
        assert.propEqual(tag_child_1.elements, [tag_child_3])
        assert.propEqual(tag_child_3.elements, [tag_child_4])
        assert.equal(tag.inner_html(), expected_inner_html_4)
        assert.equal(tag.html(),expected_html_4)
    })

    QUnit.test('.add_to', function (assert) {
        const tag_id = 'an_id'
        const target = $(`<tag id='${tag_id}'>`)[0]                                     // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal(target.outerHTML, `<tag id="${tag_id}"></tag>`)

        assert.equal($(`#${tag_id}`).html(), undefined, `${tag_id} is undefined`)
        $(`<div id='${tag_id}'>`).appendTo('body')                                      // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${tag_id}`).html(), ''       , `${tag_id} is an empty string`)
        const tag = new Html_Tag({tag_name:'tag', id:'an_tag'});
        tag.set_style('top', '10px');
        tag.set_style('border', '2px solid');
        const expectedHtml = '<tag id="an_tag" style="border: 2px solid; top: 10px;">\n</tag>\n';        // Expected HTML result

        tag.add_to(`#${tag_id}`);
        const actualHtml = $(`#${tag_id}`).html()                                       // Get the value of the id from the DOM
        assert.strictEqual(actualHtml, expectedHtml, "The tag's HTML should match the expected HTML and be appended to the body");   // Test whether the tag was added to the fixture

        // Clean up by removing the added div
        $(`#${tag_id}`).remove()                                                        // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${tag_id}`).html(), undefined)
    });

    QUnit.test('.default_styles()',  function (assert) {
        const tag = new Html_Tag();

        const random_styles = {};                                                          // Generate random values for attributes and set them
        Object.keys(tag.default_styles()).forEach((attr) => {
            random_styles[attr] = Math.random().toString(36).substring(2, 15);       // Generate a random string for each attribute
        });
        tag.set_styles(random_styles)


        let expected_styles = ""
        for (let [attr, value] of Object.entries(random_styles)) {
            expected_styles += `${attr}: ${value}; `;
        }
        expected_styles = expected_styles.trim()
        let expected_html = `<tag id="${tag.id}" style="${expected_styles}">\n</tag>\n`;

        const actual_html = tag.html();
        assert.equal(actual_html, expected_html, "Html generated with all attributes matches the expected output");
    })

    QUnit.test('.set_style', function (assert) {
        const tag        =   new Html_Tag()
        const tag_styles = tag.styles
        tag.set_style('top', '10px')
        assert.equal(tag_styles.top, '10px')
    })

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const html_tag = new Html_Tag();
        assert.ok(html_tag instanceof Html_Tag                     , 'Instance created is an instance of Html_Tag');
        assert.strictEqual(Html_Tag.prototype.constructor, Html_Tag, 'Html_Tag.prototype.constructor is Html_Tag');
        assert.equal(html_tag.tag_name, 'tag')
  });
})