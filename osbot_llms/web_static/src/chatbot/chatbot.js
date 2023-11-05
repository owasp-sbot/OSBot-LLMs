export default class Chatbot {
    load_control(targetDiv) {
        $(targetDiv).load('/static/src/chatbot/chatbot-control.html', () => {
            const event = new Event('chatbot-module-loaded');
            document.dispatchEvent(event);
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
    send_test_messages(){
        this.send_message_incoming('1st incomming message')
        this.send_message_outgoing('1st outgoing message')
        this.send_message_incoming('2nd incomming message')
        this.send_message_outgoing('2nd outgoing message')
    }
}