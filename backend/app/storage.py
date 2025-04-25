import os
import uuid
from supabase import create_client, Client

SUPABASE_URL  = os.getenv("SUPABASE_URL")
SUPABASE_KEY  = os.getenv("SUPABASE_ANON_KEY")
_BUCKET       = "pdfs"

_client: Client | None = None

def sb() -> Client:
    """Singleton Supabase client."""
    global _client
    if _client is None:
        if not (SUPABASE_URL and SUPABASE_KEY):
            raise RuntimeError("Supabase env vars missing")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client

def upload_pdf(binary_data: bytes) -> str:
    """
    Upload raw PDF bytes to Supabase Storage.
    Returns storage path like 'pdfs/<uuid>.pdf'
    """
    uid = f"{uuid.uuid4()}.pdf"
    path = f"{_BUCKET}/{uid}"
    sb().storage.from_(_BUCKET).upload(uid, binary_data,
                                       {"content-type": "application/pdf"})
    return path          
def download_pdf(path: str) -> bytes:
    """
    Download and return PDF bytes from Supabase Storage path.
    Accepts either 'pdfs/uuid.pdf' or 'uuid.pdf'
    """
    key = path.split("/", 1)[-1]  
    return sb().storage.from_(_BUCKET).download(key).data
