from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
import uuid, fitz
from pathlib import Path
from langchain_huggingface import HuggingFaceInferenceAPIEmbeddings
from .storage import upload_pdf
from .models import Document, get_session
import os


EMBEDDER = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.getenv("HF_TOKEN"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
CHUNK = 1_000
OVERLAP = 100
STORE_DIR = Path(__file__).resolve().parent.parent / "storage"


def ingest(pdf_bytes: bytes, orig_name: str) -> str:
    doc_id = str(uuid.uuid4())

    sp_path = upload_pdf(pdf_bytes)

    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = pdf.page_count
    text = "\n".join(p.get_text() for p in pdf)

    splitter = CharacterTextSplitter(chunk_size=CHUNK, chunk_overlap=OVERLAP)
    docs = splitter.create_documents([text])
    vs = FAISS.from_documents(docs, EMBEDDER)

    idx_path = STORE_DIR / doc_id
    vs.save_local(str(idx_path))

    with get_session() as s:
        s.add(
            Document(
                id=doc_id,
                filename=orig_name,
                pages=pages,
                supabase_path=sp_path,
            )
        )
        s.commit()

    return doc_id