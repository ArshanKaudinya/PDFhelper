from datetime import datetime
from pathlib import Path
from sqlmodel import SQLModel, Field, create_engine, Session


class Document(SQLModel, table=True):
    id: str = Field(primary_key=True)    
    filename: str
    pages: int
    supabase_path: str                         
    created_at: datetime = Field(default_factory=datetime.utcnow)

DB_PATH = Path(__file__).resolve().parent.parent / "app.db"
engine = create_engine(f"sqlite:///{DB_PATH}")

def init_db() -> None:
    """Create tables if they don't exist."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Session:
    return Session(engine)
