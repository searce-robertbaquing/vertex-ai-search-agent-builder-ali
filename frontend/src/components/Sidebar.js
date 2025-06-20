import React, { useState } from 'react';
import { FaUpload, FaList, FaSlidersH, FaPlus } from 'react-icons/fa';
import UploadPanel from './UploadPanel';
import DocumentList from './DocumentList';
import ParameterPanel from './ParameterPanel';

const Sidebar = () => {
    const [activeView, setActiveView] = useState('parameters');

    const handleNewChat = () => {
        // A simple page refresh will clear the session now
        window.location.reload();
    };
    
    const MenuButton = ({ view, label, icon, currentView, setView }) => (
        <button
            onClick={() => setView(view)}
            className={`w-full flex items-center p-3 text-sm font-semibold rounded-md transition-colors ${currentView === view ? 'bg-ayala-green-dark text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <aside className="h-full bg-gray-800 text-white flex flex-col flex-shrink-0 w-72">
            <div className="p-4 border-b border-gray-700">
                <button onClick={handleNewChat} className="w-full flex items-center justify-between p-2 text-lg font-semibold rounded-md hover:bg-gray-700">
                    <span>New Chat</span>
                    <FaPlus />
                </button>
            </div>
            
            <nav className="p-4 space-y-2 border-b border-gray-700">
                <MenuButton view="upload" label="Upload New Files" icon={<FaUpload />} currentView={activeView} setView={setActiveView} />
                <MenuButton view="list" label="Existing Documents" icon={<FaList />} currentView={activeView} setView={setActiveView} />
                <MenuButton view="parameters" label="Search Parameters" icon={<FaSlidersH />} currentView={activeView} setView={setActiveView} />
            </nav>

            <div className="flex-grow p-4 overflow-y-auto">
                {activeView === 'upload' && <UploadPanel />}
                {activeView === 'list' && <DocumentList />}
                {activeView === 'parameters' && <ParameterPanel />}
            </div>
            {/* ... footer ... */}
        </aside>
    );
};

export default Sidebar;