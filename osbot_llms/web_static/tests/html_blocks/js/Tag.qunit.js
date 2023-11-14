import '../../../lib/jquery-3.7.1.min.js'
import Tag  from "../../../src/html_blocks/js/Tag.js";

QUnit.module('Html_Tag', function(hooks) {
    hooks.before(function (assert) {
        //window.Html_Tag = Html_Tag                                        // expose the Div object in the browser's window (to make it easier to test and debug from a browser)
    })

    QUnit.test('. parent', function (assert) {
        const tag_parent = new Tag({id:'tag_parent'})
        const tag_child  = new Tag({id:'tag_child' })
        tag_parent.add(tag_child)
        assert.equal(tag_child.parent(), tag_parent)
    });

    QUnit.test('.clone', function (assert) {
        const tag = new Tag({class:'an_class'})
        const tag_cloned_1 = tag.clone()
        assert.equal(tag.class , tag_cloned_1.class )

        assert.notEqual(tag.id    , tag_cloned_1.id, "cloned id is differentfrom original tag" )
        assert.notEqual(tag.html(), tag_cloned_1.html())

        const tag_cloned_2 = tag.clone({id:'changed'})
        assert.notEqual(tag.id, tag_cloned_2.id    )
        assert.equal   (tag.class, tag_cloned_2.class )
        assert.equal   (tag.element_parent         , tag_cloned_2.element_parent           )
        assert.equal   (tag.styles.top             , tag_cloned_2.styles.top               )
        assert.notEqual(tag.elements               , tag_cloned_2.elements                 )

        const tag_cloned_3 = tag.clone({id:'changed'})
        tag_cloned_3.element_parent = 'aaaa'
        tag_cloned_3.styles.top     = '20'
        tag_cloned_3.html_config.include_tag = false
        assert.notEqual(tag.element_parent         , tag_cloned_3.element_parent)
        assert.equal   (tag.styles.top             , null                       )
        assert.equal   (tag.html_config.include_tag, true                       )
        assert.equal   (tag.html_config.include_tag, true                       )
        assert.notEqual(tag.elements               , tag_cloned_3.elements      )

    })

    QUnit.test('.constructor', function (assert) {
        const tag           = new Tag()
        const random_id     = tag.id
        const expected_html = `<tag id="${random_id}">\n</tag>\n`

        assert.equal(tag.tag, 'tag')
        assert.ok(tag.id.startsWith('tag_'), 'tag.id should start with "tag_"');
        assert.ok(tag instanceof Tag)
        assert.equal(tag.tag, 'tag')
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
        assert.propEqual(tag.html_config, { include_end_tag         : true,
                                            include_tag             : true ,
                                            include_id              : true ,
                                            indent_before_last_tag  : true ,
                                            new_line_before_elements: true ,
                                            new_line_after_final_tag: true ,
                                            trim_final_html_code    : false})
        assert.equal(tag.html(),expected_html)
    });

    QUnit.test('.add_element', function (assert) {
        const tag_id         = 'parent'
        const tag_child_1_id = 'child_1'
        const tag            = new Tag({id: tag_id         })                                    // parent div
        const tag_child_1    = new Tag({id: tag_child_1_id })                                    // add a div to the parent div
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
        assert.equal(tag.tag        , 'tag'         )
        assert.equal(tag_child_1.tag, 'tag'         )
        assert.equal(tag.id              , tag_id        )
        assert.equal(tag_child_1.id      , tag_child_1_id)

        tag.add_element(tag_child_1)
        assert.equal(tag.elements.length,1)
        assert.equal(tag.elements[0], tag_child_1)
        assert.equal(tag.parent()        , null)
        assert.equal(tag_child_1.parent(), tag )
        assert.equal(tag.inner_html(), expected_inner_html_1)
        assert.equal(tag.html(), expected_html_1)

        const tag_child_2 = new Tag({tag_name:'tag', id:'child_2'})                                           // add another tag to the parent tag
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
        assert.equal(tag.elements.length,2)
        assert.equal(tag.elements[0],tag_child_1)
        assert.equal(tag.elements[1],tag_child_2)
        assert.equal(tag.parent()        , null)
        assert.equal(tag_child_1.parent(), tag )
        assert.equal(tag_child_2.parent(), tag )
        assert.equal(tag.inner_html(), expected_inner_html_2)
        assert.equal(tag.html(), expected_html_2)

        const tag_child_3 = new Tag({tag_name:'tag',id:'child_3'})                                            // add another tag to the parent tag
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
        assert.equal(tag.elements.length,2)
        assert.equal(tag_child_1.elements.length,1)
        assert.equal(tag_child_1.elements[0],tag_child_3)
        assert.equal(tag.parent()        , null        )
        assert.equal(tag_child_1.parent(), tag         )
        assert.equal(tag_child_2.parent(), tag         )
        assert.equal(tag_child_3.parent(), tag_child_1 )
        assert.equal(tag.inner_html(), expected_inner_html_3)
        assert.equal(tag.html(),expected_html_3)

        const tag_child_4 = new Tag({tag_name:'tag',id:'child_4'})                                            // add a child tag to the last child tag
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
        assert.equal(tag.elements.length,2)
        assert.equal(tag_child_3.elements.length,1)
        assert.equal(tag_child_3.elements[0],tag_child_4)
        assert.equal(tag.parent()        , null        )
        assert.equal(tag_child_1.parent(), tag         )
        assert.equal(tag_child_2.parent(), tag         )
        assert.equal(tag_child_3.parent(), tag_child_1 )
        assert.equal(tag_child_4.parent(), tag_child_3 )
        assert.equal(tag.inner_html(), expected_inner_html_4)
        assert.equal(tag.html(),expected_html_4)

        window.tag= tag
    })

    QUnit.test('.add_to', function (assert) {
        const tag_id = 'an_id'
        const target = $(`<tag id='${tag_id}'>`)[0]                                     // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal(target.outerHTML, `<tag id="${tag_id}"></tag>`)

        assert.equal($(`#${tag_id}`).html(), undefined, `${tag_id} is undefined`)
        $(`<div id='${tag_id}'>`).appendTo('body')                                      // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${tag_id}`).html(), ''       , `${tag_id} is an empty string`)

        const tag = new Tag({tag_name:'tag', id:'an_tag'});
        tag.set_style('top', '10px');
        tag.set_style('border', '2px solid');
        const expectedHtml = '<tag id="an_tag" style="border: 2px solid; top: 10px;">\n</tag>\n';        // Expected HTML result
        assert.equal(tag.dom_add_to_id(tag_id), true, "tag added to dom")

        const actualHtml = $(`#${tag_id}`).html()                                       // Get the value of the id from the DOM
        assert.strictEqual(actualHtml, expectedHtml, "The tag's HTML should match the expected HTML and be appended to the body");   // Test whether the tag was added to the fixture

        // Clean up by removing the added div
        $(`#${tag_id}`).remove()                                                        // todo: remove jQuery dependency (once Div API is more mature)
        assert.equal($(`#${tag_id}`).html(), undefined)
        window.tag = tag
    });

    QUnit.test('.default_styles()',  function (assert) {
        const tag = new Tag();

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

    QUnit.test('.html.html_config.include_tag', function (assert) {
        const tag = new Tag()
        assert.equal(tag.html_config.include_tag, true)
        assert.equal(tag.html(), `<tag id="${tag.id}">\n</tag>\n`)

        tag.html_config.include_tag = false
        assert.equal(tag.html_config.include_tag, false)
        assert.equal(tag.html(), `\n\n`)                            // todo: understand better the side effects, this is casued by html_config.new_line_before_elements and html_config.new_line_after_final_tag
    })

    QUnit.test('.html.html_config.include_end_tag', function (assert) {
        const tag = new Tag()
        assert.equal(tag.html_config.include_end_tag, true)
        assert.equal(tag.html(), `<tag id="${tag.id}">\n</tag>\n`)

        tag.html_config.include_end_tag = false
        assert.equal(tag.html_config.include_end_tag, false)
        assert.equal(tag.html(), `<tag id="${tag.id}"/>\n`)
    })

    QUnit.test('.html - with no id', function (assert) {
        const tag = new Tag()
        assert.equal(tag.html_config.include_id, true)
        tag.html_config.include_id = false
        assert.equal(tag.html(), `<tag>\n</tag>\n`)
    })

    QUnit.test('.html - extra attributes',  function (assert) {
        const key   = 'an key'
        const value = 'an value'
        const tag = new Tag({attributes: {key, value}})
        const expected_html = `<tag id="${tag.id}" key="${key}" value="${value}">\n</tag>\n`
        assert.equal(tag.html(), expected_html)
    })

    QUnit.test('.html - mixed attributes',  function (assert) {
        const expected_html = '<textarea placeholder="Enter a message..." spellcheck="false" required></textarea>'
        const attributes = {placeholder:"Enter a message...", spellcheck:"false", required:null}
        const textarea    = new Tag({tag:'textarea', attributes:attributes})
        textarea.html_config.include_id               = false
        textarea.html_config.new_line_before_elements = false
        textarea.html_config.new_line_after_final_tag = false
        assert.equal(textarea.html(), expected_html)
        //assert.expect(0)
    });

    QUnit.test('.html - with value',  function (assert) {
        const value = 'an value'
        const tag = new Tag({value: value})
        assert.equal(tag.value, value)
        const expected_html = `<tag id="${tag.id}">${value}</tag>\n`
        assert.equal(tag.html(), expected_html)                             // when value is set, the html should just be the value
    })


    QUnit.test('.set_style', function (assert) {
        const tag        =   new Tag()
        const tag_styles = tag.styles
        tag.set_style('top', '10px')
        assert.equal(tag_styles.top, '10px')
    })

    QUnit.test('.dom_set_styles',  function (assert) {
        const tag        =   new Tag()
        assert.equal(tag.dom_add       ()        , true  )
        assert.equal(tag.dom_styles    ().opacity, 1     )
        assert.equal(tag.dom_styles    ().top    , 'auto')
        assert.equal(tag.dom_set_style ('opacity', 0.3     ), tag)
        assert.equal(tag.dom_set_styles({opacity: 0.3, top:'50px'}) , tag)
        assert.equal(tag.dom_styles    ().opacity, 0.3   )
        assert.equal(tag.dom_styles    ().top    , '50px')
        assert.equal(tag.dom_remove    ()        , true  )
    })

    QUnit.test('.dom_apply_styles',  function (assert) {
        const tag        =   new Tag()
        tag.set_style('top', '10px')
        tag.dom_add()
        assert.equal(tag.dom_styles().top, '10px')
        assert.equal(tag.dom().style.top , '10px')
        tag.styles.top = '20px'
        assert.equal(tag.dom().style.top , '10px')
        tag.dom_apply_styles()
        assert.equal(tag.dom().style.top, '20px')
    });

    QUnit.test('_should be an instance and inherit from Html_Tag', function(assert) {
        const html_tag = new Tag();
        assert.ok(html_tag instanceof Tag                     , 'Instance created is an instance of Html_Tag');
        assert.strictEqual(Tag.prototype.constructor, Tag, 'Html_Tag.prototype.constructor is Html_Tag');
        assert.equal(html_tag.tag, 'tag')
  });
})