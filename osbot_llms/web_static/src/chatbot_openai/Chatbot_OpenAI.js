
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
            const message = event.detail.message
            await this.post_openai_prompt_with_stream(message)
        });
    }

    apply_ui_tweaks () {
        //this.messages.add_message_received(this.innial_message)
        this.input.value                 = this.initial_prompt
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

        if (!response.ok) { return `error: ${response.status}` } // todo : add better error handler

        const result = await response.json();
        const answer = result.answer;
        return answer                                            // todo: convert this to events
    }

    async post_openai_prompt_with_stream(user_prompt) {
        const url = '/open_ai/prompt_with_system__stream';
        const histories = this.calculate_histories()
        const data = { model            : "gpt-4-1106-preview",
                       user_prompt      : user_prompt         ,
                       system_prompts   : []                  ,
                       histories        : histories           }

        try {
          this.dispatchEvent(new CustomEvent('streamStart', {
                    bubbles : true    ,                         // allows the event to bubble up through the DOM
                    composed: true    ,                         // allows the event to cross shadow DOM boundaries
              }));

          const response = await fetch(url, {
            method : 'POST',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }


          const reader = response.body.getReader();                     // Handling the stream
          const decoder = new TextDecoder('utf-8');

          const processStream = async ({done, value}) => {
            if (done) {
              this.dispatchEvent(new CustomEvent('streamComplete', {
                    bubbles : true    ,                         // allows the event to bubble up through the DOM
                    composed: true    ,                         // allows the event to cross shadow DOM boundaries
              }));
              return;
            }


            const chunk = decoder.decode(value, {stream: true});                            // Decode and process chunk

            //console.log(chunk.replace(/\n/g, '\\n'));

            let fixed_chunk = chunk.replace(/\n\n/g, '{{DOUBLE_NEWLINE}}');
            fixed_chunk = fixed_chunk.replace(/\n/g, '');
            fixed_chunk = fixed_chunk.replace(/{{DOUBLE_NEWLINE}}/g, '\n\n');

            //const fixed_chunk = chunk.replace(/\n$/, '');
            this.dispatchEvent(new CustomEvent('streamData', {
                bubbles : true    ,                         // allows the event to bubble up through the DOM
                composed: true    ,                         // allows the event to cross shadow DOM boundaries
                detail: fixed_chunk }));                          // Emit an event with the chunk

            reader.read().then(processStream);                                              // Read the next chunk
          };

          reader.read().then(processStream);

        } catch (error) {
          console.error('Error:', error);
          this.events.dispatchEvent(new CustomEvent('streamError', { detail: error.message }));
        }
    }

    calculate_histories() {
        const histories = []
        let question = null
        let answer = null
        console.log(this.messages.childNodes.length)
        this.messages.childNodes.forEach(message => {
            if (message.message_raw) {
                if (question === null) {
                    question = message.message_raw
                } else if (answer === null) {
                    answer = message.message_raw
                    histories.push({question, answer})
                    question = answer = null
                }
            }

        //     const question = message.text
        //     const answer   = message.text
        //     histories.push({question, answer})
        })
        return histories
    }

    // "histories": [
    //     {
    //       "question": "My name is John",
    //       "answer": "Hi John"
    //     }
}

Chatbot_OpenAI.define()