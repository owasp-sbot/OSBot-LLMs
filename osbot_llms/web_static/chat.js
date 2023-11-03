function config_ui() {
        // Send the form on enter keypress and avoid if shift is pressed
        $('#prompt').keypress(function(event) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                $('form').submit();
            }
        });
        $('form').on('submit', function(event) {
            event.preventDefault();

            var prompt = $('#prompt').val();

            $('#response').append('<p id="GFG1"><i class="bi bi-person"></i>: ' + prompt + '</p>');
            $('#response #GFG1').css({"color": "green", "width": "90%", "float": "left", "white-space": "pre-wrap"});
            $('#response').scrollTop($('#response')[0].scrollHeight);

            //fetchStream(prompt)
            fetchStream(prompt).catch(e => console.error('There has been a problem with your fetch operation:', e));

        });

        // Event handler for dropdown change
        $('#questionDropdown').change(function() {
            var selectedQuestion = $(this).val(); // Get selected value
            $('#prompt').val(selectedQuestion); // Set value of textarea
            $('form').submit();
        });

        // ... rest of your existing setup ...
    };

    //async code


var url = '/open_ai/prompt_with_system__stream';
//url = 'http://localhost:8000/open_ai/prompt_with_system__stream';
url = 'https://7crg65ubx4wo3mujxqr5dys7ci0gbenh.lambda-url.eu-west-2.on.aws/open_ai/prompt_with_system__stream'

async function fetchStream(user_prompt) {


    const payload = {   model           : "gpt-3.5-turbo",
                        user_prompt     : user_prompt    ,
                        system_prompts  : ["string"     ]};

    // Send the POST request using Fetch API
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }


    // Get the readable stream from the response body
    const reader = response.body.getReader();

    // Read the stream

    const $paragraph = $('<p id="GFG2"> <i class="bi bi-robot"></i>: </p>');
    const $response = $('#response');

    $paragraph.css({"color": "blue", "width": "90%", "float": "right"});
    $('#response').append($paragraph);


    while (true) {
        const {done, value} = await reader.read();

        if (done) {
            break;
        }

        // Convert the Uint8Array to a string and process the chunk
        const chunk = new TextDecoder().decode(value);
        const chuck_no_new_line = chunk.replace(/\n/g, '');
        $paragraph.append(chuck_no_new_line);
        //console.log($paragraph)
        $('#response').scrollTop($('#response')[0].scrollHeight);
    }
    return response

}

function load_ui(target_div, url_ui) {
    return new Promise((resolve, reject) => {
        $(target_div).load(url_ui, function(response, status, xhr) {
            if (status === "error") {
                var msg = "Sorry but there was an error: ";
                console.error(msg + xhr.status + " " + xhr.statusText);
                reject(new Error(msg + xhr.status + " " + xhr.statusText));
            } else {
                resolve();
            }
        });
    });
}