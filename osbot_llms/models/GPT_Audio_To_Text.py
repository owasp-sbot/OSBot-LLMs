from fastapi import  UploadFile
from pydantic import BaseModel


class GPT_Audio_To_Text(BaseModel):
    audio_base_64 : str