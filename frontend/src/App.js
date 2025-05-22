import React, { useState } from "react";
// No longer importing App.css as styles are in index.css or Tailwind
import SearchComponent from "./components/SearchComponent";
import ResponseItem from "./components/SearchResponseList";
import ParameterPanel from "./components/ParameterPanel";
import { SearchProvider, SearchContext } from "./context/SearchContext";
import { FaPaperclip, FaTrash, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload first.');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://34.93.181.110:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File upload successful:', response.data); 
      alert('File uploaded successfully!');
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.response ? error.response.data.detail : error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-page-bg text-text-secondary">
        {/* Header */}
        <header className="bg-header-bg shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left part: Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/logo.png" 
                  alt="Ayala Land Logo"
                  className="h-10 w-auto" 
                />
              </div>

              {/* Center part: Title */}
              <div className="flex-grow text-center">
                <h1 className="text-2xl font-semibold text-ayala-green-dark">
                  AyalaLand Compass: Self Service AI Search
                </h1>
              </div>

              {/* Right part: Spacer to balance the logo for title centering */}
              <div className="flex-shrink-0" style={{ width: 'calc(2.5rem + 1rem)' }}>
                {/* This space can be used for other icons/menu in the future */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* File Upload Section */}
          <section className="mb-8 p-6 bg-card-bg rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-ayala-green-dark mb-4">Upload Knowledge Base File</h2>
            <div className="flex items-center space-x-3">
              <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 bg-gray-100 text-text-secondary text-sm font-medium rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
                <FaPaperclip size={18} className="mr-2 -ml-1 text-text-muted" />
                <span>{fileName ? "Change file" : "Select PDF file"}</span>
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf"
                disabled={isUploading}
              />

              {fileName && (
                <div className="flex items-center text-sm bg-gray-100 p-2 rounded-md flex-grow min-w-0">
                  <span className="text-text-secondary truncate" title={fileName}>{fileName}</span>
                  <button
                    type="button"
                    onClick={() => { if (!isUploading) {setFile(null); setFileName('');} }}
                    className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                    disabled={isUploading}
                    aria-label="Remove file"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}

              {file && (
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center px-6 py-2 bg-ayala-green-dark text-white text-sm font-semibold rounded-md shadow-sm hover:bg-ayala-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayala-green-DEFAULT disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              )}
            </div>
            { !fileName && !isUploading && <p className="text-xs text-text-muted mt-2">Select a PDF file to upload to the knowledge base.</p>}
          </section>

          <section className="mb-8">
            <SearchComponent />
          </section>

          <section className="mb-8 p-6 bg-card-bg rounded-lg shadow-md">
            <div className="flex items-start">
              <img
                src="/google-gemini-icon.png" 
                alt="AI Summary Icon"
                className="w-8 h-8 mr-4 text-ayala-green"
              />
              <div>
                <h2 className="text-lg font-semibold text-ayala-green-dark mb-1">Summary</h2>
                <SearchContext.Consumer>
                  {({ searchResults }) => (
                    <p className="text-text-secondary leading-relaxed">
                      {searchResults && searchResults.summary
                        ? searchResults.summary.summaryText
                        : "Your answer summary will appear here after a search."}
                    </p>
                  )}
                </SearchContext.Consumer>
              </div>
            </div>
          </section>

          <section className="flex flex-col md:flex-row md:space-x-8">
            <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
              <ParameterPanel />
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4">
              <SearchContext.Consumer>
                {({ searchResults }) => (
                  <ResponseItem response={searchResults} />
                )}
              </SearchContext.Consumer>
            </div>
          </section>
        </main>
      </div>
    </SearchProvider>
  );
}

export default App;
