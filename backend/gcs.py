from google.cloud import storage
import os

BUCKET_NAME = os.getenv("BUCKET_NAME")

def list_documents_in_gcs():
    """Lists all documents in the GCS bucket under the 'docs/' prefix."""
    if not BUCKET_NAME:
        raise ValueError("BUCKET_NAME environment variable is not set.")

    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    
    blobs = bucket.list_blobs(prefix="docs/")
    
    documents = []
    for blob in blobs:
        # Skip folder placeholders
        if blob.name.endswith('/'):
            continue
            
        documents.append({
            "name": os.path.basename(blob.name),
            "size": blob.size,
            "last_modified": blob.updated.isoformat()
        })
        
    return documents