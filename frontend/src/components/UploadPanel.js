import React, { useState, useContext } from 'react';
import { FaPaperclip, FaTrash, FaSpinner } from 'react-icons/fa';
import { uploadFile } from '../api/backend';
import { SearchContext } from '../context/SearchContext';

const UploadPanel = () => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleRemoveFile = (fileName) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const handleFileUpload = async () => {
        if (files.length === 0) {
            alert("Please select a file to upload first.");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });
        try {
            await uploadFile(formData);
            // Architect's Note: Updated alert message as requested.
            alert("Upload complete. The documents will be processed and will appear in the 'Existing Documents' list when ready for querying.");
            setFiles([]);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.detail : "Network Error";
            alert(`Error uploading files: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">Upload New Files</h3>
            <label htmlFor="file-upload" className="w-full inline-flex items-center justify-center px-4 py-2 bg-ayala-green-dark text-white text-sm font-semibold rounded-md shadow-sm hover:bg-ayala-green cursor-pointer">
                <FaPaperclip size={16} className="mr-2" />
                <span>Select Files</span>
            </label>
            <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf" 
                multiple
                disabled={isUploading}
            />
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map(file => (
                        <div key={file.name} className="flex items-center text-sm bg-gray-600 p-2 rounded-md">
                            <span className="truncate" title={file.name}>{file.name}</span>
                            <button type="button" onClick={() => handleRemoveFile(file.name)} className="ml-auto text-red-400 hover:text-red-300 disabled:opacity-50" disabled={isUploading} aria-label={`Remove ${file.name}`}>
                                <FaTrash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {files.length > 0 && (
                <button type="button" onClick={handleFileUpload} disabled={isUploading} className="mt-4 w-full inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-70">
                    {isUploading ? <><FaSpinner className="animate-spin mr-2" />Uploading...</> : `Upload ${files.length} File(s)`}
                </button>
            )}
        </div>
    );
};

export default UploadPanel;