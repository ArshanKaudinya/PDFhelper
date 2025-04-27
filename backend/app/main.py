from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from dotenv import load_dotenv
from .models import init_db
from .ingestion import ingest
from .qa import load_chain


MAX_MB = 10

init_db()
load_dotenv() 

app = FastAPI(title="PDF-QA API")


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping", include_in_schema=False)
def ping():
    return {"alive": True}


@app.post("/upload", tags=["documents"])
async def upload(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    data = await file.read()
    if len(data) > MAX_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="PDF larger than 10 MB")

    doc_id = ingest(data, file.filename)
    return {"doc_id": doc_id}

@app.post("/ask", tags=["documents"])
async def ask(doc_id: str = Body(...), question: str = Body(...)):
    chain = load_chain(doc_id)
    res = chain.invoke({"query": question})
    return {
        "answer": res["result"]
    }