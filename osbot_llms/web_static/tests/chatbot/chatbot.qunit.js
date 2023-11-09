QUnit.module('chatbot', function(hooks) {

    hooks.before(function(assert) {
        this.wallaby = document.location.href.includes('wallaby')
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        var done = assert.async();
        var this_closure=this
        if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {
            var virtual_path = "../../../../../OSBot-LLMs/osbot_llms/web_static/src/chatbot"
        } else {
            var virtual_path = "/static/src/chatbot"
        }
        //var virtual_path = "/static/src/chatbot"                          // this works in qunit in browser at http://localhost:8000/static-tests/chatbot/test-chatbot.html
        var page_path = `${virtual_path}/chatbot.html`

        this.div_id    = 'chatbot_div'
        this.$chatbot_div  = $(`<div id='${this.div_id}'>`)
        this.$chatbot_div.appendTo('body')

        this.$chatbot_div.load(page_path, function(response, status, xhr) {
            this_closure.response     = response
            this_closure.status       = status
            this_closure.xhr          = xhr
            // we need to wait for this event due to the multiple different ways the execution happens (between Wallaby and Browser based tests)
            document.addEventListener('chatbot-module-loaded', function() {
                done()
            });
        })
     })

    hooks.after(function(assert) {
         //console.log('[hooks.after]: before after test execution')
     })

    QUnit.test('check chatbot.html was loaded ok',   function (assert) {
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        assert.equal   (this.xhr.status         , 200 , "xhr.status is 200"            )
        assert.equal   (this.xhr.statusText     , 'OK', 'xhr.statusText is OK'         )
        assert.notEqual(this.$chatbot_div.html(), ''  , 'chatbot_div.html is not empty')
        assert.ok($(`#${this.div_id}`).is( this.$chatbot_div), `div_id ${this.div_id} is in the DOM`)

        const script_js_vars = window.get_script_js_vars()
        expected_script_js_vars = { chatbox         : {}     ,
                                    chatInput       : {}     ,
                                    sendChatBtn     : {}     ,
                                    userMessage     : null   ,
                                    API_KEY         : '.....',
                                    inputInitHeight : script_js_vars.inputInitHeight }
        assert.propEqual(script_js_vars, expected_script_js_vars)
    })

    // QUnit.skip('check chatbot.js file', function(assert) {
    //     assert.ok(typeof Chatbot === 'function', 'Chatbot is a function'); // Classes are functions behind the scenes.
    //     assert.ok(Chatbot.prototype, 'Chatbot has a prototype'); // Classes should have a prototype.
    //     assert.ok(Chatbot.prototype.constructor === Chatbot, 'Chatbot prototype constructor is Chatbot itself'); // The constructor should be the class itself.
    //
    // })

    QUnit.test('check text contents and attributes', function(assert) {
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        var $chatbotDiv = this.$chatbot_div;

        // Check close button text
        var $closeButton = $chatbotDiv.find('.close-btn');
        assert.equal($closeButton.text().trim(), 'close', 'Close button text is "close"');

        // Check textarea placeholder
        var $textarea = $chatbotDiv.find('textarea');
        assert.equal($textarea.attr('placeholder'), 'Enter a message...', 'Textarea placeholder is correct');

        // Check textarea spellcheck and required attributes
        assert.equal($textarea.attr('spellcheck'), 'false', 'Textarea spellcheck attribute is "false"');
        assert.equal($textarea.attr('required'), 'required', 'Textarea required attribute is present');

        // Check the send button id
        var $sendButton = $chatbotDiv.find('#send-btn');
        assert.ok($sendButton.length, 'Send button with id "send-btn" exists');

        // Check script tag defer attribute value
        var $scriptTag = $chatbotDiv.find('script[src="../../src/chatbot/script.js"]');
        assert.equal($scriptTag.attr('defer'), 'defer', 'Script tag has "defer" attribute set correctly');

        assert.equal($sendButton.attr('id'), 'send-btn', 'Send button id is "send-btn"');
        assert.ok($scriptTag.prop('defer'), 'Script tag has defer attribute set to true');
        var $linkTags = $chatbotDiv.find('link[rel="stylesheet"]');
        $linkTags.each(function() {
            assert.equal($(this).attr('rel'), 'stylesheet', 'Link tag has rel="stylesheet"');
            //assert.equal($(this).attr('type'), 'text/css', 'Link tag has type="text/css"');
        });
        var $smartToyIcon = $chatbotDiv.find('.chatbox .chat.incoming .material-symbols-outlined');
        assert.equal($smartToyIcon.text().trim(), 'smart_toy', 'Chat includes "smart_toy" icon');


    });
    QUnit.test('test chatbot_div html text contents', function (assert) {
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        var chat_bot_div_html = this.$chatbot_div.html();
        var $html = $('<div>').append(chat_bot_div_html); // Create a jQuery object to search within

        // Check that chatbot_div.html is not empty
        assert.notEqual(chat_bot_div_html, '', 'chatbot_div.html is not empty');

        // Check the text content of the <h2> element
        var $h2 = $html.find('.chatbot header h2');
        assert.equal($h2.text().trim(), 'Chatbot', 'The <h2> tag contains the text "Chatbot"');

        var $botGreeting = $html.find('.chatbox .chat.incoming p');
        assert.ok($botGreeting.text().includes('Hi there'), 'The greeting message contains "Hi there 👋"');
        assert.ok($botGreeting.text().includes('How can I help you today?'), 'The greeting message contains "How can I help you today?"');

        // You can continue adding assertions for other text contents as needed
    });

    QUnit.test('test chatbot_div html contents',  function (assert)  {
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        chat_bot_div_html = this.$chatbot_div.html()
        var $html = $('<div>').append(chat_bot_div_html); // Create a jQuery object to search within

        // Check that chatbot_div.html is not empty
        assert.notEqual(chat_bot_div_html, '', 'chatbot_div.html is not empty');

        // Check for the presence of required styles and scripts
        assert.ok($html.find('link[href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"]').length, 'Contains Material Symbols Outlined');
        assert.ok($html.find('link[href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"]').length, 'Contains Material Symbols Rounded');
        //assert.ok($html.find('link[href="/static/src/chatbot/style.css"]').length, 'Contains chatbot stylesheet');
        assert.ok($html.find('script[src="../../src/chatbot/script.js"]').attr('defer'), 'Contains chatbot script with defer attribute');

        // Check for chatbot structure
        var $chatbotStructure = $html.find('.show-chatbot');
        assert.ok($chatbotStructure.length, 'Contains .show-chatbot div');
        var $chatbot = $chatbotStructure.find('.chatbot');
        assert.ok($chatbot.length, 'Contains .chatbot div');

        // Check for header and close button
        var $header = $chatbot.find('header');
        assert.ok($header.length, 'Contains header');
        assert.ok($header.find('.close-btn.material-symbols-outlined').length, 'Contains close button with material symbols outlined');

        // Check for chatbox and message structure
        var $chatbox = $chatbot.find('.chatbox');
        assert.ok($chatbox.length, 'Contains chatbox ul');
        assert.ok($chatbox.find('.chat.incoming').length, 'Contains incoming chat li');
        assert.ok($chatbox.find('.material-symbols-outlined').length, 'Contains material symbols outlined span within chat');

        // Check for chat input
        var $chatInput = $chatbot.find('.chat-input');
        assert.ok($chatInput.length, 'Contains chat-input div');
        assert.ok($chatInput.find('textarea').length, 'Contains textarea');
        assert.ok($chatInput.find('#send-btn.material-symbols-rounded').length, 'Contains send button with material symbols rounded');

    })


    QUnit.test('test createChatLi ability to send messages',  function (assert)  {
        if (this.wallaby) {
            assert.expect(0); // No assertions expected
            return; // Exit the test
        }
        assert.expect(0)
        chatbox        = document.querySelector(".chatbox");
        chatbox.append(createChatLi("!!this is a message from the test", "outgoing"))
        chatbox.append(createChatLi("this is a reply", "incoming"))
        chatbox.append(createChatLi("....another user question", "outgoing"))
    })

    QUnit.test('confirm jquery is loaded', function (assert) {
        jquery_version = '3.7.1'
        assert.equal($.fn.jquery, jquery_version,`confirmed that jQuery version is ${jquery_version}` )
    })
})


// QUnit.done(function() {
//   console.log('[QUnit.done]: all tests are done, expanding all tests to show messages')
//   document.querySelectorAll('.qunit-assert-list').forEach(function(element) {
//     element.classList.remove('qunit-collapsed');
//
//   });
//});