from typing import List
from google.api_core.client_options import ClientOptions
from google.cloud import discoveryengine_v1 as discoveryengine
from wrapper import proto_to_dict
import os

PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")
AGENT_APPLICATION_ID = os.getenv("AGENT_APPLICATION_ID") # This is your Engine ID

# Define the preamble for the summary
SUMMARY_PREAMBLE = "Use a professional tone suitable for executive. Structure information in HTML encoded form with bullets and bold / italics and Use tables when appropriate to present information"

SUMMARY_PREAMBLE = "Use a professional tone suitable for executive."


@proto_to_dict
def search_discovery_engine(
    search_query: str,
    location: str = "global",
    summary_result_count: int = 5,
    page_size: int = 100,
    max_snippet_count: int = 5,
    include_citations: bool = True,
    use_semantic_chunks: bool = True,
    max_extractive_answer_count: int = 5,
    max_extractive_segment_count: int = 5,
) -> List[discoveryengine.SearchResponse]:
    """
    Searches the Discovery Engine for documents matching the provided query.
    Args are as previously defined.
    Returns:
        List[discoveryengine.SearchResponse]: A list of search responses from the Discovery Engine.
    """

    client_options = (
        ClientOptions(api_endpoint=f"{LOCATION}-discoveryengine.googleapis.com")
        if LOCATION != "global"
        else None
    )
    client = discoveryengine.SearchServiceClient(client_options=client_options)

    if not PROJECT_ID:
        raise ValueError("PROJECT_ID environment variable is not set.")
    if not LOCATION:
        raise ValueError("LOCATION environment variable is not set.")
    if not AGENT_APPLICATION_ID:
        raise ValueError("AGENT_APPLICATION_ID (Engine ID) environment variable is not set.")

    # Construct the serving_config path using the f-string for a Search App Engine
    serving_config = f"projects/{PROJECT_ID}/locations/{LOCATION}/collections/default_collection/engines/{AGENT_APPLICATION_ID}/servingConfigs/default_config"

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
            model_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec.ModelSpec(
                version="stable",
            ),
        ),
        extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
            max_extractive_answer_count=max_extractive_answer_count,
            max_extractive_segment_count=max_extractive_segment_count,
            return_extractive_segment_score=True,
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
    return response
