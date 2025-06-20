import React, { createContext, useState } from "react";
import { search } from "../api/backend";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastQuery, setLastQuery] = useState("");

  // Search parameters for the stateless search API
  const [pageSize, setPageSize] = useState(5);
  const [summaryResultCount, setSummaryResultCount] = useState(3);
  const [maxSnippetCount, setMaxSnippetCount] = useState(1);
  const [maxExtractiveAnswerCount, setMaxExtractiveAnswerCount] = useState(2);
  const [maxExtractiveSegmentCount, setMaxExtractiveSegmentCount] = useState(1);

  const handleSearch = async (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm || isLoading) return;

    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage && lastMessage.type === 'user' && lastMessage.content === trimmedSearchTerm) {
        return; // Prevent duplicate consecutive queries
    }
    
    setLastQuery(trimmedSearchTerm);
    const userMessage = { type: 'user', content: trimmedSearchTerm };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    const searchParams = {
        query: trimmedSearchTerm,
        page_size: pageSize,
        summary_result_count: summaryResultCount,
        max_snippet_count: maxSnippetCount,
        max_extractive_answer_count: maxExtractiveAnswerCount,
        max_extractive_segment_count: maxExtractiveSegmentCount,
    };

    try {
        const results = await search(searchParams);
        const botMessage = { type: 'bot', content: results };
        setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
        console.error("Search failed:", error);
        setChatHistory(prev => prev.slice(0, -1)); // Remove the user's query on error
        alert("An error occurred during the search. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };


  const value = {
    chatHistory,
    isLoading,
    handleSearch,
    lastQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    pageSize, setPageSize,
    summaryResultCount, setSummaryResultCount,
    maxSnippetCount, setMaxSnippetCount,
    maxExtractiveAnswerCount, setMaxExtractiveAnswerCount,
    maxExtractiveSegmentCount, setMaxExtractiveSegmentCount,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export { SearchContext, SearchProvider };