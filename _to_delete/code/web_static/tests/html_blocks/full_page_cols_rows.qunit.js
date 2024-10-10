QUnit.module('full_page_cols_rows.html', function(hooks) {

    hooks.before(function(assert) {
        var done         = assert.async();
        var this_closure = this
        window.this      = this
        this.div_id      = 'html_block'
        if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {
            var virtual_path = "../../../../../OSBot-LLMs/osbot_llms/web_static/src/html_blocks"
        } else {
            var virtual_path = "/static/src/html_blocks"
        }
        var page_path      = `${virtual_path}/full_page_cols_rows.html`
        if ($(`#${this.div_id}`).length ==0) {
            this.$block_div  = $(`<div id='${this.div_id}'>`)
            this.$block_div.appendTo('body')
        }
        else {
            this.$block_div  = $(`#${this.div_id}`)
        }
        this.$block_div.load(page_path, function(response, status, xhr) {
            this_closure.response = response
            this_closure.status   = status
            this_closure.xhr      = xhr
            this_closure.div_html    = this_closure.$block_div.html()
            done()
        })
    })

    // QUnit.test('debug wallaby', function(assert) {
    //     assert.ok(true)
    // })

    QUnit.test('check block.html was loaded ok',  function (assert) {
        assert.equal   (this.xhr.status               , 200           , "xhr.status is 200"            )
        assert.equal   (this.xhr.statusText           , 'OK'          , 'xhr.statusText is OK'         )
        assert.notEqual(this.$block_div.html()        , ''            , 'chatbot_div.html is not empty')
        assert.equal   (this.$block_div.html()        , this.div_html , "div_html is set ok")
        assert.equal   (($(`#${this.div_id}`).length) , 1             , "found div"                    )
        assert.notEqual(this.$html                    , ''            , 'chatbot_div.html is not empty')
        assert.ok($(`#${this.div_id}`).is( this.$block_div)           , `div_id ${this.div_id} is in the DOM`)
    });


    // QUnit.skip('Simple Animation', function(assert) {
    //     assert.expect(0)
    //     $('#html_block').animate({ left: '+=100px' }, 100).animate({ left: '-=100px' }, 100).fadeOut().fadeIn();
    // })
})


/*
    example of jQuery Animations

    $('#html_block').fadeOut(2000).fadeIn(2000)

    $('#html_block').slideUp(2000).slideDown(2000);

    $('#html_block').animate({
            left: "+=50px" // This will move the element 50px to the right
            }, 2000);
        var $elem = $('#html_block'),
        degree = 0,
        timer;
    function rotate() {
      $elem.css({ transform: 'rotate(' + degree + 'deg)'});
      // increment the degree of rotation
      degree++;
      // loop the function
      timer = setTimeout(rotate, 5);
    }
    rotate(); // Call the rotate function

    $('#html_block').animate({ left: '+=100px' }, 2000);
    // To stop the animation in between
    $('#html_block').stop();

    $('#html_block').slideUp(2000).delay(1000).slideDown(2000);

    $('#html_block').animate({ left: '+=100px' }, 2000).queue(function(next) {
          $(this).css('background-color', 'red');
        next();
        });

    $('#html_block').toggle(2000);


 */