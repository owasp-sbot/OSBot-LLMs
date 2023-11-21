
import WebC_Chat_Bot from "../html_blocks/web_components/WebC__Chat_Bot.js";

export default class Chatbot_OpenAI extends WebC_Chat_Bot{

    constructor() {
        super()
        this.innial_message = 'Good morning, how can I help you'
        //this.openai_model       = "gpt-4-1106-preview" //
        //this.openai_model       = "gpt-3.5-turbo"
        this.openai_model       = 'gpt-4-vision-preview'
        this.openai_seed        = 42
        this.openai_temperature = 0.0
        this.max_tokens         = 2048
        this.initial_prompt     = 'Hi'
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
            const user_prompt = message.user_prompt
            const images      = message.images
            console.log(user_prompt)
            console.log(images)
            await this.post_openai_prompt_with_stream(user_prompt, images)
        });
    }

    apply_ui_tweaks () {
        this.messages.innerHTML =
`<i>
  date       : <b>${new Date().toLocaleString()}</b>   
| temperature: <b>${this.openai_temperature}</b>
| seed       : <b>${this.openai_seed}</b>
| model      : <b>${this.openai_model}</b>
</i><hr/>
`
        //this.messages.add_message_received(this.innial_message)
        this.input.value                 = this.initial_prompt
    }

    //todo refactor into separate Openai helper class
    async post_openai_prompt_simple(user_prompt) {
        const url    = '/open_ai/prompt_simple';
        const data   = { model      : this.openai_model,
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

    async post_openai_prompt_with_stream(user_prompt, images) {
        const url = '/open_ai/prompt_with_system__stream';
        const histories = this.calculate_histories()
        const data = { model            : this.openai_model      ,
                       temperature      : this.openai_temperature,
                       seed             : this.openai_seed       ,
                       max_tokens       : this.max_tokens        ,
                       user_prompt      : user_prompt            ,
                       images           : images                 ,
                       system_prompts   : []                     ,
                       histories        : histories              }
        //console.log(data)

        this.messages.messages_div_scroll_to_end()

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

          this.messages.messages_div_scroll_to_end()

          const processStream = async ({done, value}) => {
            if (done) {
              this.dispatchEvent(new CustomEvent('streamComplete', {
                    bubbles : true    ,                         // allows the event to bubble up through the DOM
                    composed: true    ,                         // allows the event to cross shadow DOM boundaries
              }));
              this.messages.messages_div_scroll_to_end()
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

    // todo refactor this code to use the Data__Chat_Bot class which has proper support for storing messages
    calculate_histories() {
        const histories = []
        let question = null
        let answer   = null
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