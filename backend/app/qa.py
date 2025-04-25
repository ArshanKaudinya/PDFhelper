from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceEndpoint
import os

EMBEDDER = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

_MODEL_ID = "google/flan-t5-small"  
tok = AutoTokenizer.from_pretrained(_MODEL_ID)
mod = AutoModelForSeq2SeqLM.from_pretrained(_MODEL_ID)
pipe = pipeline(
    "text2text-generation",
    model=mod,
    tokenizer=tok,
    max_length=256,
    do_sample=False,
)
LLM = HuggingFaceEndpoint(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    task="text-generation",
    temperature=0.2,
    max_tokens=350,
    huggingface_api_token=os.getenv("HF_TOKEN"),
    wait_for_model=True,
)

QA_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "Use the following PDF excerpt to answer the question concisely.\n\n"
        "{context}\n\nQuestion: {question}\nAnswer:"
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
