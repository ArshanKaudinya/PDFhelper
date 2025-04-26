from langchain_community.embeddings import HuggingFaceEmbeddings

EMBEDDER = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
