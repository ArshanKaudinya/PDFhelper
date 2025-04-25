from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, create_engine

class Document(SQLModel, table=True):
    id: str = Field(primary_key=True)       
    filename: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    pages: int
    supabase_path: str                      

sqlite_url = "sqlite:///../app.db"         
engine = create_engine(sqlite_url, echo=False)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
