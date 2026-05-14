from init_chat_model import model

# Simple test
response = model.invoke("Hello, what is 2+2?")
print("Response:", response.content)