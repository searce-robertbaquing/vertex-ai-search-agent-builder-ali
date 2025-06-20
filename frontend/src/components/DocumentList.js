import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaSync } from 'react-icons/fa';
import { listDocuments } from '../api/backend';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocuments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listDocuments();
            setDocuments(data);
        } catch (err) {
            setError('Failed to fetch documents.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase">Indexed Documents</h3>
                <button onClick={fetchDocuments} disabled={isLoading} className="text-gray-400 hover:text-white disabled:opacity-50">
                    <FaSync className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>
            {isLoading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!isLoading && !error && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {documents.length > 0 ? documents.map(doc => (
                        <div key={doc.id} className="flex items-center text-sm bg-gray-600 p-2 rounded-md">
                            <FaFilePdf className="mr-2 text-red-400 flex-shrink-0" />
                            <div className="truncate flex-grow" title={doc.title}>
                                <p className="font-medium text-white">{doc.title}</p>
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-400">No documents found.</p>}
                </div>
            )}
        </div>
    );
};

export default DocumentList;