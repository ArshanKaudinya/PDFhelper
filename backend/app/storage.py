import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
_BUCKET = "pdfs"

_client: Client | None = None


def supabase() -> Client:
    global _client
    if _client is None:
        if not (SUPABASE_URL and SUPABASE_KEY):
            raise RuntimeError("Supabase keys missing – check .env")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def upload_pdf(name: str, data: bytes) -> str:
    """
    Uploads bytes to Supabase Storage bucket and
    returns the storage path (e.g. 'pdfs/<name>').
    """
    path = f"{name}.pdf"
    supabase().storage.from_(_BUCKET).upload(path, data, {"content-type": "application/pdf"})
    return f"{_BUCKET}/{path}"


def download_pdf(path: str) -> bytes:
    return supabase().storage.from_(_BUCKET).download(path).data
