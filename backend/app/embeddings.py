from dotenv import load_dotenv
load_dotenv()

from langchain_together import TogetherEmbeddings
import os

EMBEDDER = TogetherEmbeddings(
    model="togethercomputer/m2-bert-80M-8k-retrieval",
    api_key=os.getenv("OPENAI_API_KEY")
)
