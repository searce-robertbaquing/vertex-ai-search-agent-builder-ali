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
AGENT_APPLICATION_ID = os.getenv("AGENT_APPLICATION_ID") # This is your Engine ID

# A more robust prompt to ensure the summary model returns valid JSON
SUMMARY_PREAMBLE = """
Provide a concise summary of the following documents.
Your response MUST be a single, valid JSON object with the following schema:
{
  "summary": "Your summary of the documents here."
}
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

    # This is the corrected serving_config using the DATA_STORE_ID
    serving_config = f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection/engines/{AGENT_APPLICATION_ID}/servingConfigs/default_config"


    logger.info(f"Using serving configuration: {serving_config}")

    content_search_spec = discoveryengine.SearchRequest.ContentSearchSpec(
        snippet_spec=discoveryengine.SearchRequest.ContentSearchSpec.SnippetSpec(
            return_snippet=True,
            max_snippet_count=max_snippet_count
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
    if response.summary and response.summary.summary_text:
        try:
            # Parse the JSON string from the model's summary response
            summary_data = json.loads(response.summary.summary_text)
            results["summary"] = summary_data
        except json.JSONDecodeError:
            # Fallback if the model returns a non-JSON string
            results["summary"] = {"summary": "The model returned a summary in an unexpected format."}
    else:
        results["summary"] = None

    return results