import os
from langchain_ollama import ChatOllama

os.environ["GOOGLE_API_KEY"] = "AIzaSyCAcvM310COp3OeBk8zAOQqRZhEObKK_h4"

model = ChatOllama(
    model="llama3.2:1b",
    base_url="http://localhost:11434",
    temperature=0.7
)