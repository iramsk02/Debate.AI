import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

def get_model(
    model_name: str = "llama-3.3-70b-versatile",
    temperature: float = 0.7,
):
    return ChatGroq(
        model=model_name,
        temperature=temperature,
        api_key=os.getenv("GROQ_API_KEY"),
        streaming=True
    )
