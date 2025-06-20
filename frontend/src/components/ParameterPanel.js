import React, { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import { FaSync } from 'react-icons/fa';

const ParameterPanel = () => {
    // Architect's Note: Correctly destructuring all relevant parameters and their setters
    // from the context, as required by our stable, non-conversational backend.
    const {
        pageSize, setPageSize,
        summaryResultCount, setSummaryResultCount,
        maxSnippetCount, setMaxSnippetCount,
        maxExtractiveAnswerCount, setMaxExtractiveAnswerCount,
        maxExtractiveSegmentCount, setMaxExtractiveSegmentCount,
        lastQuery,
        handleSearch, // Using handleSearch directly is more robust
        isLoading,
    } = useContext(SearchContext);

    // Reusable sub-component for consistent UI
    const InputRow = ({ label, value, onChange, min, max, title }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" title={title}>
                {label}
            </label>
            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={onChange}
                disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-ayala-green-DEFAULT focus:border-ayala-green-DEFAULT sm:text-sm disabled:opacity-50"
            />
        </div>
    );

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">
                Adjust Search Parameters
            </h3>
            <div className="space-y-4">
                <InputRow
                    label="Page Size"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    min={1} max={20}
                    title="Number of results to return per page."
                />
                <InputRow
                    label="Summary Result Count"
                    value={summaryResultCount}
                    onChange={(e) => setSummaryResultCount(Number(e.target.value))}
                    min={1} max={5}
                    title="Number of top search results to use for generating the summary."
                />
                <InputRow
                    label="Max Snippets (per result)"
                    value={maxSnippetCount}
                    onChange={(e) => setMaxSnippetCount(Number(e.target.value))}
                    min={1} max={5}
                    title="Maximum number of snippets to return for each search result."
                />
                <InputRow
                    label="Max Extractive Answers"
                    value={maxExtractiveAnswerCount}
                    onChange={(e) => setMaxExtractiveAnswerCount(Number(e.target.value))}
                    min={1} max={5}
                    title="Maximum number of extractive answers to return."
                />
                <InputRow
                    label="Max Extractive Segments"
                    value={maxExtractiveSegmentCount}
                    onChange={(e) => setMaxExtractiveSegmentCount(Number(e.target.value))}
                    min={1} max={5}
                    title="Maximum number of extractive segments to return."
                />
            </div>

            <div className="mt-6">
                <button
                    onClick={() => handleSearch(lastQuery)}
                    disabled={!lastQuery || isLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-ayala-green-dark text-white text-sm font-semibold rounded-md shadow-sm hover:bg-ayala-green disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <FaSync className="mr-2" />
                    Apply & Re-Search
                </button>
            </div>
        </div>
    );
};

export default ParameterPanel;