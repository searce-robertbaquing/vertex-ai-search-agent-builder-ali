from typing import List
from google.api_core.client_options import ClientOptions
from google.cloud import discoveryengine_v1 as discoveryengine
import os

PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")
DATASTORE_ID = os.getenv("DATASTORE_ID")

def get_document_service_client():
    """Creates and returns a Document Service client."""
    client_options = (
        ClientOptions(api_endpoint=f"{LOCATION}-discoveryengine.googleapis.com")
        if LOCATION != "global"
        else None
    )
    return discoveryengine.DocumentServiceClient(client_options=client_options)

def list_indexed_documents() -> List[dict]:
    """
    Lists all active documents in the Vertex AI Datastore, ensuring a human-readable
    title is returned.
    """
    client = get_document_service_client()
    parent = client.branch_path(
        project=PROJECT_ID,
        location=LOCATION,
        data_store=DATASTORE_ID,
        branch="default_branch",
    )
    
    request = discoveryengine.ListDocumentsRequest(parent=parent)
    
    documents = []
    for doc in client.list_documents(request=request):
        # Architect's Note: This logic is now more robust for finding the title.
        # 1. Try to get the title from the document's structured metadata.
        title = doc.struct_data.get("title")
        
        # 2. If no title in metadata, parse it from the GCS URI.
        if not title and doc.content.uri:
            title = os.path.basename(doc.content.uri)
        
        # 3. As a final fallback, use the document's ID.
        final_title = title or doc.id

        documents.append({
            "id": doc.id,
            "name": doc.name,
            "title": final_title,
        })
        
    return documents