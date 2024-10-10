
import WebC_Chat_Bot from "../html_blocks/web_components/WebC__Chat_Bot.js";

export default class Chatbot_OpenAI extends WebC_Chat_Bot{

    constructor() {
        super()
        this.innial_message = 'Good morning, how can I help you'
        //this.openai_model       = "gpt-4-1106-preview" //
        //this.openai_model       = "gpt-3.5-turbo"
        this.openai_model       = this.getAttribute('model'          ) || 'gpt-4-1106-preview' //'gpt-4-vision-preview' // Nov 2023 - reaching daily limit of 100 requests
        this.openai_seed        = this.getAttribute('seed'           ) || 42
        this.openai_temperature = this.getAttribute('temperature'    ) || 0.0
        this.max_tokens         = this.getAttribute('max_tokens'     ) || 2048
        this.initial_prompt     = this.getAttribute('initial_prompt' ) || ''
        this.initial_message    = this.getAttribute('initial_message') || null
        this.url                = this.getAttribute('url'            ) || '/open_ai/prompt_with_system__stream';
        this.bot_name           = this.getAttribute('name'           ) || 'OpenAI ChatBot'
        this.chat_thread_id     = this.random_uuid()
        window.chatbot = this
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
            await this.post_openai_prompt_with_stream(user_prompt, images)
        });
    }

    apply_ui_tweaks () {
//         this.messages.innerHTML =
// `<i>
//   date       : <b>${new Date().toLocaleString()}</b>
// | temperature: <b>${this.openai_temperature}</b>
// | seed       : <b>${this.openai_seed}</b>
// | model      : <b>${this.openai_model}</b>
// </i><hr/>
// `
        //this.messages.add_message_received(this.innial_message)
        this.input.value                 = this.initial_prompt
        if (this.initial_message !== null) {
            this.messages.add_message_initial(this.initial_message)
        }
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

    system_prompts() {
        const dom_system_prompt = document.querySelector('#system_prompt')
        if (dom_system_prompt !== null) {
            const system_prompt = dom_system_prompt.innerHTML
            window.dom_system_prompt = dom_system_prompt
            return [system_prompt]
        }
        return []
    }
    async post_openai_prompt_with_stream(user_prompt, images) {
        var storedData = localStorage.getItem('user_data');
        var user_data = storedData ? JSON.parse(storedData) : {};

        const histories = this.calculate_histories()
        const data = { chat_thread_id   : this.chat_thread_id    ,
                          model            : this.openai_model      ,
                          temperature      : this.openai_temperature,
                          seed             : this.openai_seed       ,
                          max_tokens       : this.max_tokens        ,
                          user_prompt      : user_prompt            ,
                          images           : images                 ,
                          system_prompts   : this.system_prompts()  ,
                          histories        : histories              ,
                          user_data        : user_data              }

        const event = new CustomEvent('promptSent', {
            bubbles : true    ,
            composed: true    ,
            detail  : { data } });
        this.dispatchEvent(event);


        this.messages.messages_div_scroll_to_end()

        try {
          this.dispatchEvent(new CustomEvent('streamStart', {
                    bubbles : true    ,                         // allows the event to bubble up through the DOM
                    composed: true    ,                         // allows the event to cross shadow DOM boundaries
              }));

          const response = await fetch(this.url, {
            method : 'POST',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
              // todo : refator to raise event method
              this.dispatchEvent(new CustomEvent('streamData', {
                bubbles : true    ,                         // allows the event to bubble up through the DOM
                composed: true    ,                         // allows the event to cross shadow DOM boundaries
                detail: `HTTP error! Status: ${response.status}` }));                          // Emit an event with the chunk
            //throw new Error(`HTTP error! Status: ${response.status}`);
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
          //console.error('Error:', error);
          // todo : refator to raise event method
              this.dispatchEvent(new CustomEvent('streamData', {
                bubbles : true    ,                         // allows the event to bubble up through the DOM
                composed: true    ,                         // allows the event to cross shadow DOM boundaries
                detail: `streamError: ${error.message}` }));                          // Emit an event with the chunk

          this.events.dispatchEvent(new CustomEvent('streamError', { detail: error.message }));
        }
    }
    // todo refactor this code to use the Data__Chat_Bot class which has proper support for storing messages
    calculate_histories() {
        const histories = []
        let question = null
        let answer   = null
        this.messages.childNodes.forEach(message => {
            if (message.message_raw && message.type !=='initial') {
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
    random_uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}

Chatbot_OpenAI.define()