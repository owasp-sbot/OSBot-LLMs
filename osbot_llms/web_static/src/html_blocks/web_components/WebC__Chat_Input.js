import Web_Component      from "./Web_Component.js";
import Tag                from "../js/Tag.js";

export default class WebC__Chat_Input extends Web_Component {

    constructor() {
        super();
    }

    // properties
    get input() {
        return this.query_selector('#user-prompt')
    }

    get images() {
        return this.query_selector('.chat-images')
    }

    // methods

    add_event_hooks() {
        this.input.addEventListener('keydown', (event) => this.on_input_keydown(event))
        this.input.addEventListener('paste', (event) => this.process_paste(event))
    }

    connectedCallback() {
        this.build()
        this.add_event_hooks()
    }

    build() {
        this.add_css_rules(this.css_rules())
        this.set_inner_html(this.html())
        this.setup_upload_button()
    }

    css_rules() {
        return { "*": {"font-family": "Verdana"},
                 ".chat-input"       : { "padding":       "10px"                         ,
                                         "background"    : "#fff"                        ,
                                         "box-shadow"    : "0 -2px 10px rgba(0,0,0,0.1)" ,
                                         "display"       : "flex"                        ,
                                         "align-items"   : "center"                      },
                 ".chat-input input" : { "width"         : "96%"                         ,
                                         "padding"       : "10px"                        ,
                                         "border-radius" : "20px"                        ,
                                         "border"        : "1px solid #ccc"              },
                 "#file-input"       : { "opacity"       : "0px"                         ,   /* Hide the file input */
                                         "position"      : "absolute"                    ,
                                         "z-index"       : "-1"                          },  /* Place it behind the scene */
                 ".file-input-label" : { "margin-right"  : "8px"                         ,   /* Spacing between button and input box */
                                         "cursor"        : "pointer"                     }}  /* Change cursor on hover over the label */
    }

    html() {
        //todo add back this HTML mode
        // const tag = new Tag()
        // const div_chat_input = tag.clone({tag: 'div', class: 'chat-input'})
        // const div_images = tag.clone({tag: 'div', class: 'chat-images'})
        // const input_chat_input = tag.clone({
        //     tag: 'input',
        //     attributes: {type: 'text', placeholder: 'Enter a message...'}
        // })
        //
        // div_chat_input.add(div_images)
        // div_chat_input.add(input_chat_input)
        // input_chat_input.html_config.include_end_tag = false
        //return div_chat_input.html()
        const new_html = `
<div class="chat-images"></div>
<div class="chat-input">    
    <input id='file-input' type="file" />
    <label for="file-input" class="file-input-label">+</label>
    <input id='user-prompt' type="text" placeholder="Enter a message..."/>
</div>
`
        return new_html
    }

    setup_upload_button() {
        const element = this.query_selector('#file-input')
        window.element = element
        element.addEventListener('change', () => {
              var reader = new FileReader();
              reader.onloadend = () => {
                    var base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                    //console.log(`got image of size ${base64String.length}`)
                    const image_prefix = 'data:image/png;base64,'
                    this.displayImage(image_prefix + base64String);
              }
              reader.readAsDataURL(element.files[0]);
            });

    }

    input_images_urls() {
        const images_urls = []
        if (this.images.children.length) {
            for (let image of this.images.children) {
                images_urls.push(image.src)
            }
        }
        return images_urls
    }

    async on_input_keydown(event) {
        // todo: remove e_.key once test event trigger is working
        if (event.key === "Enter" || event._key === "Enter") {         //  todo: add this when we have support for textarea as the bot input:    && !e.shiftKey

            const user_prompt = this.input.value
            const images = this.input_images_urls()
            const event_detail = {"user_prompt": user_prompt, 'images': images}
            this.event_dispatch('new_input_message', event_detail)
            this.input.value = ''
            this.images.innerHTML  =''
        }
    }

    event_dispatch(event_name, detail) {
        const event_data = {
            bubbles: true,                         // allows the event to bubble up through the DOM
            composed: true,                         // allows the event to cross shadow DOM boundaries
            detail: detail
        }
        this.dispatchEvent(new CustomEvent(event_name, event_data))
    }

    async process_paste(event) {
        //console.log('paste event')
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;


        const imageItem = Array.from(items).find(item => item.type.startsWith('image')); // Find the first image item in the paste data
        if (imageItem) {
            //console.log('got an image')
            const imageFile = imageItem.getAsFile();
            const base64Image = await this.convertImageToBase64(imageFile); // Convert the image file to Base64
            this.displayImage(base64Image)
        }
    }

    // Converts an image file to a base64-encoded string
    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    displayImage(base64Image) {
        const style = "width:auto; height:auto; margin:10px;max-width:150px;max-height:150px"
        //"width:50px; height:50px; margin:10px"
        const img = new Tag({tag: 'img', attributes: {src: base64Image, style: style}})
        img.html_config.include_end_tag = false
        var parser = new DOMParser();
        var doc = parser.parseFromString(img.html(), 'text/html');
        var dom_img = doc.body.firstChild;


        dom_img.onload = () => {
            const realWidth = dom_img.naturalWidth;
            const realHeight = dom_img.naturalHeight;
            const sizeInBytes = this.calculateImageSize(base64Image);  // Calculate the size of the base64 string in bytes
            //console.log(`Real Width: ${realWidth}px, Real Height: ${realHeight}px, Size: ${sizeInBytes} bytes`);    // Log the statistics or do something with them
            //this.resizeImage(dom_img,512)

        };
        this.images.appendChild(dom_img)
    }

    calculateImageSize(base64String) {
        const base64WithoutHeader = base64String.split(',')[1];      // Remove the header from the base64 string and calculate the size
        return base64WithoutHeader.length * 0.75;                    // Each base64 character represents 6 bits of data
    }
    //todo implement a resize image function
    // resizeImage(image, maxSize) {
    //     let width = image.naturalWidth;
    //     let height = image.naturalHeight;
    //     // Check if the image needs to be resized
    //     console.log(`resizeImage: width: ${width} height: ${height} maxSize: ${maxSize}`)
    //     if (width > maxSize || height > maxSize) {      // Calculate the new dimensions
    //         if (width > height) {                       // Landscape
    //             height *= maxSize / width;
    //             width = maxSize;
    //         } else {                                    // Portrait or square
    //             width *= maxSize / height;
    //             height = maxSize;
    //         }
    //
    //         const canvas = document.createElement('canvas');    // Create a canvas and get the context
    //         canvas.width = width;
    //         canvas.height = height;
    //         const ctx = canvas.getContext('2d');
    //         ctx.drawImage(image, 0, 0, width, height);          // Draw the resized image on the canvas
    //         const resizedDataUrl = canvas.toDataURL('image/jpeg');  // Get the resized image data
    //         image.src = resizedDataUrl;                                 // Set the image source to the resized image
    //     }
    // }
}

WebC__Chat_Input.define()



//
//     // Display the image in the UI
//     displayImage(base64Image);
//
//     // Create the payload for API call
//     const payload = createPayload(base64Image);
//
//     // Example of what to do with the payload (e.g., log to console)
//     console.log(payload);
//
//     // Prevent the default paste behavior
//     event.preventDefault();
//   }
// });
//

//
// // Displays the base64-encoded image in the designated <img> element
// function displayImage(base64Data) {
//     console.log('got base64data')
//     window.base64Data = base64Data
//   //const imgElement = document.getElementById('previewImage');
//   //imgElement.src = base64Data;
//   //imgElement.style.display = 'block';
// }
//
// // Creates the payload for the API call
// function createPayload(base64Image) {
//   return {
//     "model": "gpt-4-vision-preview",
//     "messages": [
//       {
//         "role": "user",
//         "content": [
//           {
//             "type": "text",
//             "text": "What’s in this image?"
//           },
//           {
//             "type": "image_url",
//             "image_url": {
//               "url": `data:image/jpeg;base64,${base64Image.substring(base64Image.indexOf(',') + 1)}`
//             }
//           }
//         ]
//       }
//     ],
//     "max_tokens": 300
//   };
// }