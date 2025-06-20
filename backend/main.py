from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
import os
from env import load_dotenv
from pydantic import BaseModel
from search import search_discovery_engine
from upload import upload_to_gcs
from datastore import list_indexed_documents
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv('.env')
LOCATION = os.getenv("LOCATION")

class QueryModel(BaseModel):
    query: str
    summary_result_count: int = 3
    page_size: int = 5
    max_snippet_count: int = 1
    include_citations: bool = True
    use_semantic_chunks: bool = True
    max_extractive_answer_count: int = 2
    max_extractive_segment_count: int = 1

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/documents")
async def get_documents():
    """Endpoint to get the list of indexed documents from the datastore."""
    try:
        documents = list_indexed_documents()
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")

@app.post("/search")
async def search(query_model: QueryModel):
    try:
        # Reverted to the simpler, stateless search call
        results = search_discovery_engine(
            location=LOCATION,
            search_query=query_model.query,
            page_size=query_model.page_size,
            summary_result_count=query_model.summary_result_count,
            max_snippet_count=query_model.max_snippet_count,
            include_citations=query_model.include_citations,
            use_semantic_chunks=query_model.use_semantic_chunks,
            max_extractive_answer_count=query_model.max_extractive_answer_count,
            max_extractive_segment_count=query_model.max_extractive_segment_count
        )
        return results
    except Exception as e:
        print(f"Error during search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    gcs_uris_for_import = []
    responses = []

    for file in files:
        try:
            # ... (file validation logic remains the same)
            secure_name = os.path.basename(file.filename)
            file_name_in_gcs = f"docs/{secure_name}"
            
            # Upload to GCS
            public_url = upload_to_gcs(file.file, file_name_in_gcs, content_type="application/pdf")
            gcs_uri = f"gs://{os.getenv('BUCKET_NAME')}/{file_name_in_gcs}"
            gcs_uris_for_import.append(gcs_uri)
            
            responses.append({"file_name": secure_name, "status": "uploaded_to_gcs"})
        except Exception as e:
            responses.append({"file_name": file.filename, "status": "failed", "error": str(e)})

    # Start indexing jobs for all successfully uploaded files
    indexing_operations = []
    for uri in gcs_uris_for_import:
        try:
            # We assume one document per GCS URI for simplicity here
            operation_name = start_import_documents(gcs_uri=uri)
            # Find the original filename that corresponds to this URI
            file_name = os.path.basename(uri)
            indexing_operations.append({"operation_name": operation_name, "file_name": file_name})
        except Exception as e:
            indexing_operations.append({"operation_name": None, "file_name": os.path.basename(uri), "error": str(e)})

    return {"upload_results": responses, "indexing_operations": indexing_operations}


app.mount("/", StaticFiles(directory="static", html=True), name="static")