import os
from langchain_huggingface import HuggingFaceEndpointEmbeddings

class HFEmbed(HuggingFaceEndpointEmbeddings):
    """Unwrap HF-Inference ‘embedding’ dicts so LangChain gets bare vectors."""

    def embed_query(self, text: str):
        return super().embed_documents([text])[0]["embedding"]

    def embed_documents(self, texts):
        return [d["embedding"] for d in super().embed_documents(texts)]


EMBEDDER = HFEmbed(
    endpoint_url="https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    huggingfacehub_api_token=os.getenv("HF_TOKEN"),
)
