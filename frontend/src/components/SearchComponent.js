import React, { useState, useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { FaPaperPlane } from "react-icons/fa";

const SearchComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const { handleSearch, isLoading } = useContext(SearchContext);

  const performSearch = () => {
    if (inputValue.trim()) {
      handleSearch(inputValue);
      setInputValue(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault(); // Prevent form submission
      performSearch();
    }
  };

  return (
    <div className="relative flex items-center w-full bg-card-bg p-4 border-t border-gray-200 flex-shrink-0">
      <input
        type="text"
        className="block w-full pl-4 pr-16 py-3 border border-gray-300 rounded-lg text-lg shadow-sm"
        placeholder="Ask a question about your documents..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
      />
      <button
        onClick={performSearch}
        disabled={isLoading || !inputValue.trim()}
        className="absolute inset-y-0 right-0 flex items-center justify-center px-6 text-gray-500 hover:text-ayala-green-dark disabled:opacity-50 disabled:hover:text-gray-500"
        aria-label="Send"
      >
        <FaPaperPlane className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SearchComponent;