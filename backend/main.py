from fastapi import FastAPI, File, UploadFile, HTTPException
import os
from env import load_dotenv
from pydantic import BaseModel
from search import search_discovery_engine
from upload import upload_to_gcs
from datastore import import_documents_sample
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv('.env')

LOCATION = os.getenv("LOCATION")

class QueryModel(BaseModel):
    query: str
    summary_result_count: int = 3
    page_size: int = 10
    max_snippet_count: int = 5
    include_citations: bool = True
    use_semantic_chunks: bool = True
    max_extractive_answer_count: int = 3
    max_extractive_segment_count: int = 3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints (Must be defined BEFORE static file mounting) ---

@app.post("/search")
async def search(query_model: QueryModel):
    results = search_discovery_engine(
        location=LOCATION, search_query=query_model.query, summary_result_count=query_model.summary_result_count,
        page_size=query_model.page_size, max_snippet_count=query_model.max_snippet_count,
        include_citations=query_model.include_citations, use_semantic_chunks=query_model.use_semantic_chunks,
        max_extractive_answer_count=query_model.max_extractive_answer_count,
        max_extractive_segment_count=query_model.max_extractive_segment_count)
    return results

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        file_obj = file.file
        file_name = f"docs/{file.filename}"
        public_url = upload_to_gcs(
            file_obj, file_name, content_type="application/pdf")
        return {"file_name": file_name, "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# --- Static File Serving (Must be LAST) ---
# This serves all files from the 'static' directory and handles SPA routing.
app.mount("/", StaticFiles(directory="static", html=True), name="static")