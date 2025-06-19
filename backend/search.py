from typing import List
from google.api_core.client_options import ClientOptions
from google.cloud import discoveryengine_v1 as discoveryengine
from wrapper import proto_to_dict, log_data
import os
import json
import logging

logger = logging.getLogger(__name__)

PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")
# This is the correct ID to use for search requests.
DATA_STORE_ID = os.getenv("DATA_STORE_ID")

SUMMARY_PREAMBLE = """
Provide a concise summary of the following documents.
Your response MUST be a single, valid JSON object with the following schema:
{
  "summary": "Your summary of the documents here.",
  "references": [
    { "title": "Title of the document", "url": "URL of the document" },
    ...
  ]
}
The 'references' array should be populated from the titles and links of the provided documents.
Do not include any text or formatting outside of this JSON object.
"""

@log_data
@proto_to_dict
def search_discovery_engine(
    location: str,
    search_query: str,
    summary_result_count: int,
    page_size: int,
    max_snippet_count: int,
    include_citations: bool,
    use_semantic_chunks: bool,
    max_extractive_answer_count: int,
    max_extractive_segment_count: int,
) -> List[discoveryengine.SearchResponse.SearchResult]:
    client_options = (
        ClientOptions(api_endpoint=f"{location}-discoveryengine.googleapis.com")
        if location != "global"
        else None
    )

    client = discoveryengine.SearchServiceClient(client_options=client_options)

    # --- THIS IS THE FIX ---
    # The 'data_store' parameter now correctly uses DATA_STORE_ID.
    serving_config = client.serving_config_path(
        project=PROJECT_ID,
        location=location,
        data_store=DATA_STORE_ID,
        serving_config="default_config",
    )
    # --- END OF FIX ---

    logger.info(f"Using serving configuration: {serving_config}")

    content_search_spec = discoveryengine.SearchRequest.ContentSearchSpec(
        snippet_spec=discoveryengine.SearchRequest.ContentSearchSpec.SnippetSpec(
            return_snippet=True,
            max_snippet_count=max_snippet_count,
        ),
        summary_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec(
            summary_result_count=summary_result_count,
            include_citations=include_citations,
            model_prompt_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec.ModelPromptSpec(
                preamble=SUMMARY_PREAMBLE
            ),
            use_semantic_chunks=use_semantic_chunks,
        ),
        extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
            max_extractive_answer_count=max_extractive_answer_count,
            max_extractive_segment_count=max_extractive_segment_count,
        ),
    )

    request = discoveryengine.SearchRequest(
        serving_config=serving_config,
        query=search_query,
        page_size=page_size,
        content_search_spec=content_search_spec,
        query_expansion_spec=discoveryengine.SearchRequest.QueryExpansionSpec(
            condition=discoveryengine.SearchRequest.QueryExpansionSpec.Condition.AUTO,
        ),
        spell_correction_spec=discoveryengine.SearchRequest.SpellCorrectionSpec(
            mode=discoveryengine.SearchRequest.SpellCorrectionSpec.Mode.AUTO
        ),
    )
    
    response = client.search(request)

    results = {}
    results["results"] = response.results
    if response.summary:
        try:
            summary_data = json.loads(response.summary.summary_text)
            results["summary"] = summary_data
        except json.JSONDecodeError:
            results["summary"] = {
                "summary": "Could not decode the summary from the model. Raw response: " + response.summary.summary_text,
                "references": []
            }
    else:
        results["summary"] = None

    return results