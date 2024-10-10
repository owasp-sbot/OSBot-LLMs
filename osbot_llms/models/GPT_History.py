from pydantic import BaseModel

class GPT_History(BaseModel):
    question : str
    answer   : str