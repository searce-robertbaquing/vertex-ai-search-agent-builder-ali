import React, { useState, useContext, useEffect, useRef } from "react";
import SearchComponent from "./components/SearchComponent";
import ResponseItem from "./components/SearchResponseList";
import ParameterPanel from "./components/ParameterPanel";
import { SearchProvider, SearchContext } from "./context/SearchContext";
import { FaBars, FaPaperclip, FaTrash, FaSpinner, FaPlus } from "react-icons/fa";
import { uploadFile } from "./api/backend";
import LoadingModal from "./components/LoadingModal";

// --- Helper Components defined outside the main App function for stability ---

const Sidebar = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
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
      alert("Please select a file to upload first.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadFile(formData);
      alert("File uploaded successfully!");
      setFile(null);
      setFileName("");
    } catch (error) {
      const errorMessage = error.response ? error.response.data.detail : "Network Error";
      alert(`Error uploading file: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewChat = () => {
    window.open(window.location.href, "_blank");
  };

  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col flex-shrink-0" style={{ width: '280px' }}>
      <div className="p-4 border-b border-gray-700">
        <button onClick={handleNewChat} className="w-full flex items-center justify-between p-2 text-lg font-semibold rounded-md hover:bg-gray-700">
          <span>New Chat</span>
          <FaPlus />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Knowledge Base</h3>
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <label htmlFor="file-upload" className="w-full inline-flex items-center justify-center px-4 py-2 bg-ayala-green-dark text-white text-sm font-semibold rounded-md shadow-sm hover:bg-ayala-green cursor-pointer">
            <FaPaperclip size={16} className="mr-2" />
            <span>Upload Files</span>
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={isUploading} />
          {fileName && (
            <div className="mt-2 flex items-center text-sm bg-gray-600 p-2 rounded-md">
              <span className="truncate" title={fileName}>{fileName}</span>
              <button type="button" onClick={() => { if (!isUploading) { setFile(null); setFileName(''); } }} className="ml-auto text-red-400 hover:text-red-300 disabled:opacity-50" disabled={isUploading} aria-label="Remove file">
                <FaTrash size={16} />
              </button>
            </div>
          )}
          {file && (
            <button type="button" onClick={handleFileUpload} disabled={isUploading} className="mt-4 w-full inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-70">
              {isUploading ? <><FaSpinner className="animate-spin mr-2" />Uploading...</> : "Upload Now"}
            </button>
          )}
        </div>
        
        {/* Search Parameters Panel RESTORED */}
        <ParameterPanel />
      </div>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">&copy; AyalaLand Compass</p>
      </div>
    </aside>
  );
};

const BotResponse = ({ response }) => {
  if (response.error) return <div className="text-red-500 p-4">{response.error}</div>;
  const summaryText = response?.summary?.summary;
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      {summaryText && (
        <section className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-ayala-green-dark mb-1">Summary</h2>
          <div className="text-text-secondary leading-relaxed prose prose-sm max-w-none">{summaryText}</div>
        </section>
      )}
      <ResponseItem response={response} />
    </div>
  );
};

const ChatArea = () => {
  const { chatHistory, isLoading } = useContext(SearchContext);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  return (
    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
      {chatHistory.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-20">
          <div className="inline-block p-6 bg-card-bg rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
            <p>Upload documents and ask a question to get started.</p>
          </div>
        </div>
      )}
      {chatHistory.map((item, index) => (
        <div key={index}>
          {item.type === 'user' && (
            <div className="flex justify-end">
              <p className="inline-block bg-blue-500 text-white p-3 rounded-lg max-w-xl text-left">{item.content}</p>
            </div>
          )}
          {item.type === 'bot' && <BotResponse response={item.content} />}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <FaSpinner className="animate-spin h-8 w-8 text-ayala-green-dark" />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MainLayout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SearchContext);
  return (
    <div className="h-screen flex flex-col font-sans">
      <header className="bg-header-bg shadow-md sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center h-16 px-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-2 text-gray-600 hover:text-ayala-green-dark">
            <FaBars size={20} />
          </button>
          <div className="flex items-center">
            <img src="/logo.png" alt="Ayala Land Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-semibold text-ayala-green-dark ml-4">AI Document Assistant</h1>
          </div>
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <div className={`sidebar ${isSidebarOpen ? 'w-72' : 'w-0'} overflow-hidden h-full flex-shrink-0 transition-all duration-300 ease-in-out`}>
          <Sidebar />
        </div>
        <main className="flex-grow flex flex-col transition-all duration-300 ease-in-out bg-page-bg">
          <ChatArea />
          <SearchComponent />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <SearchProvider>
      <MainLayout />
    </SearchProvider>
  );
}

export default App;