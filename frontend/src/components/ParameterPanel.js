import React, { useState, useContext } from "react";
import ParameterInput from "./ParameterInput";
import LoadingModal from "./LoadingModal";
import { SearchContext } from "../context/SearchContext";
import { search } from "../api/backend";
import { FaSpinner } from 'react-icons/fa';

const ParameterPanel = () => {
  const { searchTermFromSearchComponent, setSearchResults } =
    useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10); 
  const [summaryResultCount, setSummaryResultCount] = useState(3); 
  const [maxSnippetCount, setMaxSnippetCount] = useState(5);
  const [maxExtractiveAnswerCount, setMaxExtractiveAnswerCount] = useState(3);
  const [maxExtractiveSegmentCount, setMaxExtractiveSegmentCount] = useState(3);

  const handleSearch = async () => {
    if (!searchTermFromSearchComponent || searchTermFromSearchComponent.trim() === "") {
      alert("Please enter a search query in the main search bar above.");
      return;
    }

    setIsLoading(true);
    setSearchResults(prevState => ({ ...prevState, isLoading: true })); 

    const searchParams = {
      query: searchTermFromSearchComponent,
      page_size: pageSize,
      summary_result_count: summaryResultCount,
      max_snippet_count: maxSnippetCount,
      max_extractive_answer_count: maxExtractiveAnswerCount,
      max_extractive_segment_count: maxExtractiveSegmentCount,
    };

    try {
      const results = await search(searchParams);
      setSearchResults({...results, isLoading: false});
    } catch (error) {
      console.error("Error performing search:", error);
      alert("Search failed. Please try again.");
      setSearchResults({ results: [], summary: null, isLoading: false }); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-card-bg rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-ayala-green-dark mb-6">Adjust Search Parameters</h2>

      <ParameterInput
        label="Results per page"
        id="pageSize"
        type="number"
        value={pageSize}
        min="1"
        max="20" 
        placeholder="e.g., 10"
        onChange={(e) => setPageSize(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Summary Result Count"
        id="summaryResultCount"
        type="number"
        value={summaryResultCount}
        min="1"
        max="5" 
        placeholder="e.g., 3"
        onChange={(e) => setSummaryResultCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Snippets (per result)"
        id="maxSnippetCount"
        type="number"
        value={maxSnippetCount}
        min="0"
        max="10"
        placeholder="e.g., 5"
        onChange={(e) => setMaxSnippetCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Extractive Answers"
        id="maxExtractiveAnswerCount"
        type="number"
        value={maxExtractiveAnswerCount}
        min="0"
        max="5" 
        placeholder="e.g., 3"
        onChange={(e) => setMaxExtractiveAnswerCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Extractive Segments"
        id="maxExtractiveSegmentCount"
        type="number"
        value={maxExtractiveSegmentCount}
        min="0"
        max="5" 
        placeholder="e.g., 3"
        onChange={(e) => setMaxExtractiveSegmentCount(Number(e.target.value))}
        disabled={isLoading}
      />

      <button
        className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 bg-ayala-green-dark text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-ayala-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayala-green-DEFAULT disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleSearch}
        disabled={isLoading || !searchTermFromSearchComponent || searchTermFromSearchComponent.trim() === ""}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </button>
      {isLoading && <LoadingModal isOpen={isLoading} />}
    </div>
  );
};

export default ParameterPanel;
