import React, { useState } from "react"; // Added useState
import "./App.css";
import SearchComponent from "./components/SearchComponent";
import ResponseItem from "./components/SearchResponseList";
import ParameterPanel from "./components/ParameterPanel";
import { SearchProvider, SearchContext } from "./context/SearchContext";
import { FaPaperclip, FaTrash } from 'react-icons/fa'; // Added FaPaperclip, FaTrash
import axios from 'axios'; // Added axios

/**
 * The main application component.
 *
 * Renders the search bar, summary, and search results.
 *
 * @returns {JSX.Element} The JSX element representing the application.
 */
function App() {
  // State for file upload functionality
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      console.log('Selected file:', selectedFile.name);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Ensure this URL matches your backend's upload endpoint
      const response = await axios.post('http://34.93.181.110:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File upload successful:', response.data);
      alert('File uploaded successfully!');
      // Clear the file input and name after successful upload
      setFile(null);
      setFileName('');
      // Optionally, refresh search results or trigger datastore import here
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.response ? error.response.data.detail : error.message}`);
    }
  };

  return (
    <SearchProvider>
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 min-h-screen flex flex-col items-center">
        <div className="w-full px-4 pt-16">
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Vertex AI Search Engine Demo
          </h1>
          <div className="flex w-full items-start justify-start mb-8 ml-4">
            <SearchComponent />
          </div>

          <div className="bg-white rounded-md p-4 w-full mb-8">
            <div className="flex items-start">
              <img
                src="/google-gemini-icon.png"
                alt="gemini"
                className="w-6 h-6 mr-4"
              />
              <div className="block">
                <p className="text-xs">Summary</p>
                <SearchContext.Consumer>
                  {({ searchResults }) => (
                    <h1 className="text-xl font-medium text-start mb-6">
                      {searchResults && searchResults.summary
                        ? searchResults.summary.summaryText
                        : "Summary will appear here for your answers"}
                    </h1>
                  )}
                </SearchContext.Consumer>
              </div>
            </div>
          </div>
          <div className="flex items-baseline">
            <ParameterPanel />
            <SearchContext.Consumer>
              {({ searchResults }) => (
                <div className="flex w-3/4 flex-col space-y-4 overflow-y-auto">
                  <ResponseItem response={searchResults} />
                </div>
              )}
            </SearchContext.Consumer>
          </div>

          {/* File Upload Section - Added here */}
          <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2 mt-8">
            {/* Hidden file input */}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf" // Changed to .pdf as per backend logic
            />
            {/* Clickable paperclip icon to trigger file input */}
            <label htmlFor="file-upload" className="p-2 text-gray-600 hover:text-blue-500 cursor-pointer">
              <FaPaperclip size={24} />
            </label>

            {/* Display selected file name and a clear button */}
            {fileName && (
              <div className="flex items-center text-sm bg-gray-100 p-2 rounded">
                <span>{fileName}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); setFileName(''); }}
                  className="ml-2 text-red-500"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            )}

            {/* Upload button, visible only if a file is selected */}
            {fileName && (
              <button
                type="button"
                onClick={handleFileUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Upload
              </button>
            )}
            {/* Text input for chat/search query can go here too, or other message features */}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default App;
