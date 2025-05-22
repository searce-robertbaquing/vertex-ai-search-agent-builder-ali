import React, { useState, useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { FaSearch } from 'react-icons/fa';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchTermFromSearchComponent, setSearchTermFromSearchComponent, searchResults } = useContext(SearchContext);
  const isLoading = searchResults?.isLoading; 

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      e.preventDefault();
      // Ensure the context is updated if the user presses Enter quickly
      // though handleChange should primarily handle this.
      if (searchTerm.trim() !== searchTermFromSearchComponent) {
         setSearchTermFromSearchComponent(searchTerm.trim());
      }
      // If you want Enter to also *trigger* the search (like clicking the button),
      // you would need to call a search function here or pass a trigger function via context.
      // For now, ParameterPanel.js handles the search trigger on button click.
    }
  };

  const handleChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm); // Update local state for the input field's value
    setSearchTermFromSearchComponent(newSearchTerm); // Update context immediately
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaSearch className="h-5 w-5 text-text-muted" />
      </div>
      <input
        type="text"
        id="searchInput"
        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-card-bg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-ayala-green-DEFAULT focus:border-ayala-green-DEFAULT text-lg shadow-sm"
        placeholder="Enter your search query..."
        value={searchTerm}
        onKeyDown={onKeyPressHandler}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>
  );
};

export default SearchComponent;
