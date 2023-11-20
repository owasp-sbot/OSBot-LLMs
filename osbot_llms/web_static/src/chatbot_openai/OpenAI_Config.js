import Web_Component from "../html_blocks/web_components/Web_Component.js";
import Div from "../html_blocks/js/Div.js";

export default class OpenAI_Config extends Web_Component {
  constructor() {
    super();
    this.form = null; // Will hold the form element reference
  }

    connectedCallback() {
        window.openai_config = this
        this.build();
    }

    build() {
        this.add_css_rules(this.css_rules());
        this.set_inner_html(this.html());
        this.form = this.query_selector('form')     // get reference to form element
        this.add_form_event_listener();             // To handle form submissionth
        this.loadConfig()
  }

  css_rules() {
    return {
      "*"            : { fontFamily: "Verdana" },
      ".header"      : { backgroundColor: "#5a4ad1",
                         color: "#fff",
                         padding: "10px",
                         textAlign: "center",
                         fontSize: "20px" },
      "form"         : { padding: "10px" },
      "label"        : { display: "block", margin: "10px 0 5px" },
      "input"        : { width: "calc(100% - 22px)", // Account for padding and border
                         padding: "10px",
                         margin: "5px 0",
                         borderRadius: "5px",
                         border: "1px solid #ccc" },
      "button"       : { padding: "10px 15px",
                         margin: "10px 0",
                         borderRadius: "5px",
                         border: "1px solid #ccc",
                         backgroundColor: "#5a4ad1",
                         color: "#fff",
                         cursor: "pointer" }
    };
  }

  html() {
    const div_openai_config = new Div({class: 'openai-config'});
    div_openai_config.add_div({class: 'header', value: 'OpenAI Config'});

    // Create the form
    const form = new Div({tag: 'form'});
    form.add_div({tag: 'label' , attributes: {for: 'api-key'}, value: 'API Key:'});
    form.add_div({tag: 'input' , attributes: {type: 'text', id: 'api-key', name: 'key'}});
    form.add_div({tag: 'label' , attributes: {for: 'temperature'}, value: 'Temperature:'});
    form.add_div({tag: 'input' , attributes: {type: 'number', id: 'temperature', name: 'temperature', step: '0.01'}});
    form.add_div({tag: 'label' , attributes: {for: 'seed'}, value: 'Seed:'});
    form.add_div({tag: 'input' , attributes: {type: 'number', id: 'seed', name: 'seed'}});
    form.add_div({tag: 'label' , attributes: {for: 'model'}, value: 'Model:'});
    form.add_div({tag: 'input' , attributes: {type: 'text', id: 'model', name: 'model'}});
    form.add_div({tag: 'button', attributes: {type: 'submit'}, value: 'Save Config'});

    div_openai_config.add(form); // Add the form to the main div

    return div_openai_config.html();
  }

  add_form_event_listener() {
     this.form.addEventListener('submit', this.handle_form_submission.bind(this));
  }

    handle_form_submission(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally

        const formData = new FormData(event.target);
        const configData = {
        key: formData.get('key'),
        temperature: formData.get('temperature'),
        seed: formData.get('seed'),
        model: formData.get('model')
        };

        console.log('Config Data:', configData);

        // Save to localStorage
        localStorage.setItem('openAIConfig', JSON.stringify(configData));

        // Indicate that the config was saved
        console.log('Configuration saved!');
    }

    loadConfig() {
        // Load the config data from localStorage
        const configData = JSON.parse(localStorage.getItem('openAIConfig'));
        if (configData) {
            //const form = this.querySelector('form');
            this.form.querySelector('#api-key'    ).value = configData.key          || '';
            this.form.querySelector('#temperature').value = configData.temperature  || '';
            this.form.querySelector('#seed'       ).value = configData.seed         || '';
            this.form.querySelector('#model'      ).value = configData.model        || '';
            console.log('Loaded Config Data:', configData);
        }
    }

}

OpenAI_Config.define();
