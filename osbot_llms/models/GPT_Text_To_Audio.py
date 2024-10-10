from pydantic import BaseModel

class GPT_Text_To_Audio(BaseModel):
    audio_text: str