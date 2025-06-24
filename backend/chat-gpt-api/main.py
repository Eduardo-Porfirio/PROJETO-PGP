from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do .env
load_dotenv()
api_key = os.getenv("CHAVE_API")

# Inicializa o cliente da OpenAI
client = OpenAI(api_key=api_key)

# Instancia o app FastAPI
app = FastAPI()

# Modelos de entrada da API
class Message(BaseModel):
    role: str  # "user", "assistant" ou "system"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# Endpoint principal do chat
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[msg.dict() for msg in request.messages]
        )
        return {"resposta": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
