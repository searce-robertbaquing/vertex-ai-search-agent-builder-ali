import React, { useContext, useEffect, useRef } from "react";
import DOMPurify from 'dompurify';
import SearchComponent from "./components/SearchComponent";
import ResponseItem from "./components/SearchResponseList";
import Sidebar from "./components/Sidebar";
import { SearchProvider, SearchContext } from "./context/SearchContext";
import { FaBars, FaSpinner } from "react-icons/fa";

const cleanSummaryHtml = (htmlString) => {
    if (!htmlString) return "";
    return htmlString.replace(/```(html)?/g, '').trim();
};

const BotResponse = ({ response, summaryRef }) => {
    if (response.error) return <div className="text-red-500 p-4">{response.error}</div>;

    const rawSummaryHtml = response.summary?.summaryText;
    const cleanedHtml = cleanSummaryHtml(rawSummaryHtml);

    return (
        <div className="space-y-6">
            {cleanedHtml && (
                <div ref={summaryRef} className="bg-blue-50 border-2 border-blue-200 p-4 md:p-6 rounded-lg">
                    <h2 className="text-xl md:text-2xl font-semibold text-ayala-green-dark mb-2">Summary</h2>
                    <div
                        className="text-text-secondary leading-relaxed prose prose-sm md:prose-base max-w-none 
                                   prose-table:bg-white prose-table:rounded-lg prose-table:shadow 
                                   prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3
                                   prose-p:mb-4"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanedHtml) }}
                    />
                </div>
            )}
            <ResponseItem response={response} />
        </div>
    );
};

const ChatArea = ({ summaryRef }) => {
    const { chatHistory, isLoading } = useContext(SearchContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (lastMessage?.type === 'bot' && summaryRef.current) {
            summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, isLoading, summaryRef]);

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
                    {item.type === 'bot' && (
                        <BotResponse
                            response={item.content}
                            summaryRef={index === chatHistory.length - 1 ? summaryRef : null}
                        />
                    )}
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
    const lastSummaryRef = useRef(null);

    return (
        <div className="h-screen flex flex-col font-sans">
            <header className="bg-header-bg shadow-md sticky top-0 z-30 flex-shrink-0">
                <div className="flex items-center h-16 px-4">
                    {/* Architect's Note: This button correctly toggles the isSidebarOpen state */}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-2 text-gray-600 hover:text-ayala-green-dark">
                        <FaBars size={20} />
                    </button>
                    <div className="flex items-center flex-grow">
                        <img src="/logo.png" alt="Ayala Land Logo" className="h-10 w-auto" />
                        <h1 className="text-lg md:text-xl font-semibold text-ayala-green-dark ml-4">AyalaLand Compass: Self Service AI Search</h1>
                    </div>
                    {/* Indexing notification component can be placed here if you keep the feature */}
                </div>
            </header>
            <div className="flex flex-grow overflow-hidden relative">
                {/* Mobile overlay, appears when sidebar is open on small screens */}
                {isSidebarOpen && (
                    <div 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        aria-hidden="true"
                    ></div>
                )}
                {/* Architect's Note: These responsive classes control the slide-in/out behavior */}
                <div className={`fixed top-0 left-0 h-full z-50 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-auto md:z-auto`}>
                    <Sidebar />
                </div>
                <main className="flex-grow flex flex-col transition-all duration-300 ease-in-out bg-page-bg">
                    <div className="flex-grow overflow-y-auto">
                        <ChatArea summaryRef={lastSummaryRef} />
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <SearchComponent />
                    </div>
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