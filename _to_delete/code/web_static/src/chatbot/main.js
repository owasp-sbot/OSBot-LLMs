import Chatbot from '../../src/chatbot/chatbot.js'

window.chatbot = new Chatbot()

if($('#chatbot-control').length===0) {          //for wallabyJS
    $('body').append('<div id="chatbot-control"></div>')
}

chatbot.load_control('#chatbot-control');
