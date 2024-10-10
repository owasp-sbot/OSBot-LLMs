import pytest
from pathlib                        import Path
from unittest                       import TestCase, IsolatedAsyncioTestCase
from openai                         import OpenAI
from osbot_utils.utils.Dev          import pprint
from osbot_utils.utils.Http         import GET_bytes_to_file
from osbot_utils.utils.Objects      import obj_info
from osbot_utils.utils.Threads      import invoke_async_function
from osbot_llms.llms.API_Open_AI    import API_Open_AI
from osbot_llms.models.GPT_History  import GPT_History


class test_API_Open_AI(TestCase):

    def setUp(self):
        self.api_open_ai = API_Open_AI()

    def test_api_key(self):
        assert self.api_open_ai.api_key().startswith('sk')

    def test_ask_using_system_prompts__with_history(self):
        api_open_ai = API_Open_AI()
        gpt_history = GPT_History(question='Hi my name is John', answer='Hi John')
        kwargs = dict(user_prompt='what is my name?',
                      histories=[gpt_history])
        result = invoke_async_function(api_open_ai.ask_using_system_prompts(**kwargs))
        assert result == 'Your name is John.'

    def test_ask_using_messages(self):
        api_open_ai = API_Open_AI()
        question = "40+2"
        messages = [{"role": "user", "content": question}]
        result = invoke_async_function(api_open_ai.ask_using_messages(messages))
        assert '42' in result

    def test_ask_using_system_prompts(self):
        api_open_ai = API_Open_AI()
        kwargs = dict(user_prompt='40+2',
                      images=None,
                      system_prompts=None,
                      histories=None,
                      model=None,
                      temperature=None,
                      seed=None,
                      max_tokens=None,
                      async_mode=False)
        result = invoke_async_function(api_open_ai.ask_using_system_prompts(**kwargs))
        assert '42' in result

    @pytest.mark.skip("add when wiring in the audio features")
    def test_text_to_audio__audio_to_text(self):
        # if current_host_offline():
        #     pytest.skip("test needs to be online")
        input_text = 'Hi, how are you?'
        audio_bytes = self.api_open_ai.text_to_audio(input_text)
        assert type(audio_bytes) is bytes
        text_from_audio = self.api_open_ai.audio_to_text(audio_bytes)
        assert text_from_audio == input_text


    @pytest.mark.skip("to wire up as a main feature, but it is working okish (need to experiment more with function names)")
    def test_with_function(self):
        questions = ["what is cyber security",                                          # ok : 1x call to cyber_security_question
                     "I want to understand how ransomware is relevant to ISO 27001" ,    # bad: both methods called
                     "What does the weather looks like today"                       ,    # ok : 1x call to non_security_questions
                     "what is your model"                                           ,    # ok : 1x call to non_security_questions
                     "what is the date today, the weather today and your GPT model" ,    # ok : 3x call to non_security_questions
                     "what is the weather today and how does it related to virus"   ,    # ok : both methods called, each with a specific question
                     "I want to learn more about ransomware, GDPR and bananas"           # ok: we get: call cyber_security_question with {"question": "I want to learn more about ransomware and GDPR", "topics": "ransomware, GDPR"}
                                                                                         #             call non_security_questions with {"question": "I want to learn more about bananas", "topics": "fruit"}

                     ]

        question_index = len(questions) -1
        model          = "gpt-4-turbo"
        user_question  = questions[question_index]
        messages = [{"role": "user", "content": user_question}]
        tools    = [ { "type": "function", "function": { "name"        : "cyber_security_question",
                                                         "description" : "The user asked a cyber security question",
                                                         "parameters"  : { "type": "object",
                                                                           "properties": { "question": { "type"       : "string"           ,
                                                                                                         "description": "the question asked"},
                                                                                           "topics"  : { "type"       : "string",
                                                                                                         "description": "the cyber security topics"}},
                                                                           "required": ["question", "topics"]}}},
                    # this was getting quite a lot of security focused quesitons
                    # { "type": "function", "function": { "name"         : "it_questions",
                    #                                      "description" : "The user asked a question about IT (Information Technology)",
                    #                                      "parameters"  : { "type": "object",
                    #                                                        "properties": { "question": { "type"       : "string"           ,
                    #                                                                                      "description": "the question asked"},
                    #                                                                        "topics"  : { "type"       : "string",
                    #                                                                                      "description": "IT topics"}},
                    #                                                        "required": ["question", "topics"]}}},
                     { "type": "function", "function": { "name"        : "non_security_questions",
                                                         "description" : "The user asked a question that is not relevant to cyber security",
                                                         "parameters"  : { "type": "object",
                                                                           "properties": { "question": { "type"       : "string"           ,
                                                                                                         "description": "the question asked"},
                                                                                           "topics"  : { "type"       : "string",
                                                                                                         "description": "IT topics"}},
                                                                           "required": ["question", "topics"]}}}
                 ]
        client = OpenAI(api_key=self.api_open_ai.api_key())

        response   = client.chat.completions.create( model     = model   ,
                                                   messages    = messages  ,
                                                   tools       = tools     ,
                                                   tool_choice = "required")  # auto is default, but we'll be explicit
        choice     = response.choices[0]
        message    = choice.message
        tool_calls = message.tool_calls
        print()
        for tool_call in tool_calls:
            function = tool_call.function
            print(f"call {function.name} with {function.arguments}")


    # new OpenAI functions/capabilities to write-up
    @pytest.mark.skip("to wire up as a main feature, but it is working really well")
    def test_experiment__text_to_audio(self):
        import openai

        client = OpenAI(api_key=self.api_open_ai.api_key())

        voice = "shimmer"
        input_text = """
        "Hi welcome, I'm XYZ your cyber security advisor"
        
        "Olá, bem-vindo, sou XYZ, sua assessora de cibersegurança."
        
        "Hola, bienvenido, soy XYZ, tu asesora de ciberseguridad."

        "Ciao, benvenuto, sono XYZ, la tua consulente per la cybersecurity."

        "Bonjour, bienvenue, je suis XYZ, votre conseillère en cybersécurité."

"""
        input_text = "Bonjour, bienvenue, je suis XYZ, votre conseillère en cybersécurité."
        speech_file_path = Path(__file__).parent / "voice-in-fr.mp3"
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input= input_text
        )

        response.stream_to_file(speech_file_path)

    @pytest.mark.skip("to wire up as a main feature, but it is working really well")
    def test_audio_to_text(self):
        client = OpenAI(api_key=self.api_open_ai.api_key())

        audio_file = Path(__file__).parent / "speech.mp3"
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        #obj_info(transcription)
        print(transcription.text)

    @pytest.mark.skip("to wire up as a main feature, working sometimes and others not")
    def test_audio_translation(self):
        client = OpenAI(api_key=self.api_open_ai.api_key())

        audio_file = Path(__file__).parent / "voice-in-fr.mp3"
        translation = client.audio.translations.create(
            model  = "whisper-1" ,
            file   = audio_file  ,
            prompt = 'from French',
            response_format = 'verbose_json' ,
            temperature = 0.2

        )
        print()
        #print(translation.text)
        obj_info(translation)
        pprint(translation.model_extra)

    @pytest.mark.skip("to wire up as a main feature, but it is working really well")
    def test_image_creation(self):
        client = OpenAI(api_key=self.api_open_ai.api_key())
        response = client.images.generate(
            model="dall-e-3",
            prompt="XYZ , The cyber security advisor",
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url
        image_path = Path(__file__).parent / 'dall-e.image.png'

        pprint(GET_bytes_to_file(image_url, image_path))
        pprint(image_url)
        pprint(image_path)

    @pytest.mark.skip("to wire up as a main feature, the mask creation looks good")
    def test_mask_generation(self):
        from PIL import Image

        image_path = 'dall-e.image.png'
        # Load the base image to understand dimensions
        base_image = Image.open(image_path)
        width, height = base_image.size

        # Create a new image for the mask with the same dimensions
        # 'RGBA' mode for color with transparency, (255, 255, 255, 255) for opaque white
        mask = Image.new('RGBA', (width, height), (0, 0, 0, 255))  # DC: use 255 instead of 0 to have the non-masked pixels to be white

        # Define the area to mask/edit: x0, y0, x1, y1
        # This creates a transparent rectangle (alpha=0) over the area to be edited
        mask_area = (10, 200, 300, 1000)  # Change these values based on your needs
        for x in range(mask_area[0], mask_area[2]):
            for y in range(mask_area[1], mask_area[3]):
                mask.putpixel((x, y), (255, 255, 255, 0))  # Set pixels to fully transparent

        # Save the mask to a file
        mask.save("dall-e.image-mask.png")

    @pytest.mark.skip("to wire up as a main feature, the merge looks good")
    def test_image_and_mask_merge(self):
        original_file       = "dall-e.image.png"
        mask_file           = "dall-e.image-mask.png"
        transparency_level  = 160
        from PIL import Image

        # Open the original image
        original_image = Image.open(original_file)
        mask_image = Image.open(mask_file)

        mask_rgba = mask_image.convert("RGBA")      # Convert the mask to RGBA to add transparency
        # Modify the mask to make it semi-transparent
        new_mask = Image.new("RGBA", mask_rgba.size)
        for x in range(mask_rgba.width):
            for y in range(mask_rgba.height):
                # Get the grayscale value from the mask
                gray = mask_rgba.getpixel((x, y))[0]  # Assuming the mask is grayscale
                # Set the same grayscale value with semi-transparency
                if gray < 255:  # Only change the black or gray parts
                    new_mask.putpixel((x, y), (gray, gray, gray, transparency_level))  # Semi-transparent
                else:
                    new_mask.putpixel((x, y), (255, 255, 255, 0))  # Fully transparent for white

        # Overlay the semi-transparent mask on the original image
        merged_image = Image.alpha_composite(original_image.convert("RGBA"), new_mask)
        # Save or display the merged image
        merged_image.save("merged_output.png")
        #merged_image.show()

    @pytest.mark.skip("to wire up as a main feature, this one doesn't seem to be working with the test image (maybe it is too complex")
    def test_edit_image_with_mask(self):
        client = OpenAI(api_key=self.api_open_ai.api_key())
        original_image = "dall-e.image.png"
        mask_file      = "dall-e.image-mask.png"
        #new_image      = "dall-e.image-v2.png"
        #prompt    = 'add people sitting in chairs'
        original_prompt = "XYZ, The cyber security advisor"
        prompt    = original_prompt + ", with animals sitting on the chairs" # ", with users sitting on the chairs"
        response = client.images.edit(
            model="dall-e-2",
            image=open(original_image, "rb"),
            mask=open(mask_file      , "rb"),
            prompt=prompt                   ,
            n=1,
            size="1024x1024"
        )
        image_url = response.data[0].url
        pprint(image_url)
        #pprint(GET_bytes_to_file(image_url, new_image))

    @pytest.mark.skip("to wire up as a main feature, this one doesn't seem to be working with the test image (maybe it is too complex")
    def test_image_variations(self):
        client = OpenAI(api_key=self.api_open_ai.api_key())
        original_image = "dall-e.image.png"

        response = client.images.create_variation(
            model="dall-e-2",
            image=open(original_image, "rb"),
            n=1,
            size="1024x1024"
        )

        image_url = response.data[0].url
        pprint(image_url)

