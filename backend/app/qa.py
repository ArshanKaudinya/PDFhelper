from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_together import Together
import os
from app.embeddings import EMBEDDER


LLM = Together(
    model="mistralai/Mixtral-8x7b-instruct-v0.1",
    temperature=0.2,
    max_tokens=350,
    api_key=os.getenv("OPENAI_API_KEY")
)

QA_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are an helpful assistant answering questions based only on the provided PDF excerpt.\n\n"
        "------------------\n"
        "{context}\n"
        "------------------\n\n"
        "Instructions:\n"
        "- Answer the question truthfully and concisely.\n"
        "- Do not make up information or speculate.\n"
        "Question: {question}\n"
        "Answer:"
    ),
)

def load_chain(doc_id: str) -> RetrievalQA:
    idx_path = Path(__file__).resolve().parent.parent / "storage" / doc_id
    db = FAISS.load_local(
        str(idx_path),
        EMBEDDER,
        allow_dangerous_deserialization=True,   
    )
    return RetrievalQA.from_chain_type(
        llm=LLM,
        retriever=db.as_retriever(search_kwargs={"k": 2}), 
        chain_type="stuff",
        chain_type_kwargs={"prompt": QA_PROMPT},
    )
