var get_script_js_vars = () => {
    var chatbotToggler = document.querySelector(".chatbot-toggler");
    var closeBtn       = document.querySelector(".close-btn");
    var chatbox        = document.querySelector(".chatbox");
    var chatInput      = document.querySelector(".chat-input textarea");
    var sendChatBtn    = document.querySelector(".chat-input span");

    var userMessage = null; // Variable to store user's message
    var API_KEY = "....."
    var inputInitHeight = chatInput?.scrollHeight;


    return {
        chatbox         : chatbox        ,
        chatInput       : chatInput      ,
        sendChatBtn     : sendChatBtn    ,
        userMessage     : userMessage    ,
        API_KEY         : API_KEY        ,
        inputInitHeight : inputInitHeight

    }
}

var createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

var generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

var handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

//todo: add back these inside the class
// chatInput?.addEventListener("input", () => {
//     // Adjust the height of the input textarea based on its content
//     chatInput.style.height = `${inputInitHeight}px`;
//     chatInput.style.height = `${chatInput.scrollHeight}px`;
// });
//
// chatInput?.addEventListener("keydown", (e) => {
//     // If Enter key is pressed without Shift key and the window
//     // width is greater than 800px, handle the chat
//     if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
//         e.preventDefault();
//         handleChat();
//     }
// });
//
// sendChatBtn?.addEventListener("click", handleChat);
//closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
//chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));