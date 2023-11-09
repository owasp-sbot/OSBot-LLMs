export default class Chatbot {
    load_control(targetDiv) {
        // for QUnit in auto-reload mode
        if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {
            var virtual_path = "../../../../../OSBot-LLMs/osbot_llms/web_static/src/chatbot"
        } else {
            var virtual_path = "/static/src/chatbot"
        }
        const page_path = `${virtual_path}/chatbot-control.html`
        $(targetDiv).load(page_path, () => {
            const event = new Event('chatbot-module-loaded');
            document.dispatchEvent(event);
            console.log(`dispatched Event: ${event.type}`)
            //$(targetDiv).hide()
        });
    }

    send_message_incoming(message) {
        const $chatbox = document.querySelector(".chatbox");
        $chatbox.append(createChatLi(message,'incoming'))
    }

    send_message_outgoing(message) {
        const $chatbox = document.querySelector(".chatbox");
        $chatbox.append(createChatLi(message,'outgoing'))
    }
    test_messages(){
        this.send_message_incoming('1st incomming message')
        this.send_message_outgoing('1st outgoing message')
        this.send_message_incoming('2nd incomming message')
        this.send_message_outgoing('2nd outgoing message')
    }
}