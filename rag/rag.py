from .init_chat_model import model
from .vector_db import vector_store

def retrieve_context(query: str) -> str:
    docs = vector_store.similarity_search(query, k=2)
    return "\n\n".join(
        f"Source: {d.metadata}\n{d.page_content}" for d in docs
    )

def stream_answer(query: str):
    ctx = retrieve_context(query)
    print("Context retrieved:\n", ctx)
    prompt = (
        "You are an assistant that uses the following context "
        "from agricultural documents to answer the user’s question.\n\n"
        f"{ctx}\n\n"
        f"Question: {query}\n"
    )

    # no stream_mode argument – just iterate the stream
    for event in model.stream(prompt):
        # ollama chunks usually come in the `delta` field; fall back to
        # other common keys just in case
        # print("Event:", event)  # debug print to see the structure of the event
        # chunk = event.get("delta") or event.get("text") or event.get("content")
       
        chunk = None

        # Case 1: event is a dict
        if isinstance(event, dict):
            chunk = event.get("content")

        # Case 2: event is an object
        elif hasattr(event, "content"):
            chunk = event.content

        # Print only valid text chunks
        if chunk:
            yield chunk
    

