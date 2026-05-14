from .embedder import embeddings
from langchain_chroma import Chroma

vector_store = Chroma(
    collection_name="agriculture_collection",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db",  # Where to save data locally, remove if not necessary
)