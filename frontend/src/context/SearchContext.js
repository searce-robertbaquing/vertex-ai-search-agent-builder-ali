// src/context/SearchContext.js
import React, { createContext, useState } from "react";
import { search } from "../api/backend";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility

  // Search parameters
  const [pageSize, setPageSize] = useState(5);
  const [summaryResultCount, setSummaryResultCount] = useState(3);
  const [maxSnippetCount, setMaxSnippetCount] = useState(1);
  const [maxExtractiveAnswerCount, setMaxExtractiveAnswerCount] = useState(2);
  const [maxExtractiveSegmentCount, setMaxExtractiveSegmentCount] = useState(1);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "" || isLoading) return;

    setChatHistory(prev => [...prev, { type: 'user', content: searchTerm }]);
    setIsLoading(true);

    const searchParams = {
      query: searchTerm,
      page_size: pageSize,
      summary_result_count: summaryResultCount,
      max_snippet_count: maxSnippetCount,
      max_extractive_answer_count: maxExtractiveAnswerCount,
      max_extractive_segment_count: maxExtractiveSegmentCount,
    };

    try {
      const results = await search(searchParams);
      setChatHistory(prev => [...prev, { type: 'bot', content: results }]);
    } catch (error) {
      console.error("Search failed:", error);
      setChatHistory(prev => [...prev, { type: 'bot', content: { error: "Search failed. Please try again." } }]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    chatHistory,
    isLoading,
    handleSearch,
    isSidebarOpen,
    setIsSidebarOpen,
    pageSize, setPageSize,
    summaryResultCount, setSummaryResultCount,
    maxSnippetCount, setMaxSnippetCount,
    maxExtractiveAnswerCount, setMaxExtractiveAnswerCount,
    maxExtractiveSegmentCount, setMaxExtractiveSegmentCount
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export { SearchContext, SearchProvider };