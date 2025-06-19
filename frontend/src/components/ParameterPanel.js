import React, { useContext } from "react";
import ParameterInput from "./ParameterInput";
import { SearchContext } from "../context/SearchContext";

const ParameterPanel = () => {
  const {
    pageSize,
    setPageSize,
    summaryResultCount,
    setSummaryResultCount,
    maxSnippetCount,
    setMaxSnippetCount,
    maxExtractiveAnswerCount,
    setMaxExtractiveAnswerCount,
    maxExtractiveSegmentCount,
    setMaxExtractiveSegmentCount,
    isLoading,
  } = useContext(SearchContext);

  return (
    <div className="bg-gray-700 rounded-lg p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">
        Adjust Search Parameters
      </h3>

      <ParameterInput
        label="Results per page"
        id="pageSize"
        type="number"
        value={pageSize}
        placeholder="e.g., 5"
        onChange={(e) => setPageSize(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Summary Result Count"
        id="summaryResultCount"
        type="number"
        value={summaryResultCount}
        placeholder="e.g., 3"
        onChange={(e) => setSummaryResultCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Snippets (per result)"
        id="maxSnippetCount"
        type="number"
        value={maxSnippetCount}
        placeholder="e.g., 1"
        onChange={(e) => setMaxSnippetCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Extractive Answers"
        id="maxExtractiveAnswerCount"
        type="number"
        value={maxExtractiveAnswerCount}
        placeholder="e.g., 2"
        onChange={(e) => setMaxExtractiveAnswerCount(Number(e.target.value))}
        disabled={isLoading}
      />
      <ParameterInput
        label="Max Extractive Segments"
        id="maxExtractiveSegmentCount"
        type="number"
        value={maxExtractiveSegmentCount}
        placeholder="e.g., 1"
        onChange={(e) => setMaxExtractiveSegmentCount(Number(e.target.value))}
        disabled={isLoading}
      />
    </div>
  );
};

export default ParameterPanel;