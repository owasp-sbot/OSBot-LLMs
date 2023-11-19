
import WebC_Chat_Bot from "../html_blocks/web_components/WebC__Chat_Bot.js";

export default class Chatbot_OpenAI extends WebC_Chat_Bot{

    constructor() {
        super()
        this.innial_message = 'Good morning, how can I help you'
        this.initial_prompt = 'Hi'
    }

    connectedCallback() {
        this.build()
    }

    build() {
        super.build()
        window.chatbot_openai = this
        this.add_event_listeners()
        this.apply_ui_tweaks()

    }
    add_event_listeners() {
        this.addEventListener('messageSent', async (event) => {
            console.log(event)
            const message = event.detail.message
            console.log(`on message sent: ${message}`)
            const response = await this.post_openai_prompt_simple(message)
            console.log(response)
            this.messages.add_message_received(response)
            //console.log(event);
            //.console.log(event.detail);
        });
    }

    apply_ui_tweaks () {
        chatbot_openai.messages.add_message_received(this.innial_message)
        chatbot_openai.input.value                 = this.initial_prompt
    }

    //todo refactor into separate Openai helper class
    async post_openai_prompt_simple(user_prompt) {
        const url    = '/open_ai/prompt_simple';
        const data   = { model      : "gpt-4-1106-preview",
                         user_prompt: user_prompt    }

        const response = await fetch(url, {
            method : 'POST',
            headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            return `error: ${response.status}`
            //return {'status': 'error', 'error': `HTTP error! Status: ${response.status}`};
        }

        const result = await response.json();
        const answer = result.answer;
        //chatbot_openai.messages.add_message_received(answer)
        return answer
    }
}

Chatbot_OpenAI.define()