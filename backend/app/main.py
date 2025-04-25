from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI(title="PDF-QA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping", tags=["health"])
async def ping():
    """Health-check endpoint."""
    return {"status": "ok"}
