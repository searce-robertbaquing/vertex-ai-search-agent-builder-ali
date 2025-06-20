import React, { useState } from "react";
import DOMPurify from 'dompurify';
import { FaChevronDown, FaChevronUp, FaRegFilePdf, FaQuoteLeft, FaListUl, FaSearch, FaBookOpen } from 'react-icons/fa';

const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!React.Children.count(children) || (Array.isArray(children) && children.every(child => !child))) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-sm md:text-base font-semibold text-gray-600 hover:text-black"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3 tracking-wide">{title}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div className="mt-4 pl-2 border-l-2 border-gray-200 ml-3 text-sm md:text-base">
          {children}
        </div>
      )}
    </div>
  );
};

const SearchResponseItem = ({ result }) => {
  const doc = result.document;
  
  const getTitle = () => {
    const derivedTitle = doc.derivedStructData?.title;
    if (derivedTitle) return derivedTitle;
    
    const originalTitle = doc.structData?.title;
    if (originalTitle) {
      return originalTitle.includes("/") ? originalTitle.split("/").pop() : originalTitle;
    }
    
    return doc.id;
  };

  const documentTitle = getTitle();

  const getSnippets = (item) => {
    const snippets = item?.derivedStructData?.snippets || [];
    if (snippets.length === 0) return null;
    
    const cleanSnippet = DOMPurify.sanitize(snippets[0].snippet);

    return (
      <div 
        className="space-y-3 prose prose-sm md:prose-base max-w-none" 
        dangerouslySetInnerHTML={{ __html: cleanSnippet }} 
      />
    );
  };
  
  const getExtractiveAnswers = (item) => {
    const answers = item?.derivedStructData?.extractive_answers || [];
    if (answers.length === 0) return null;
    return (
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div key={`extractive_answer-${index}`} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500">Page {answer.pageNumber}</p>
            <p className="text-text-primary mt-1">{answer.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const getExtractiveSegments = (item) => {
    const segments = item?.derivedStructData?.extractive_segments || [];
    if (segments.length === 0) return null;
    return (
      <div className="space-y-4">
        {segments.map((segment, index) => (
            <div key={`extractive_segment-${index}`} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 flex justify-between">
                    <span>Page {segment.pageNumber}</span>
                    {segment.relevanceScore && <span className="font-normal text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Relevance: {segment.relevanceScore.toFixed(2)}</span>}
                </p>
                <p className="text-text-primary mt-1">{segment.content}</p>
            </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-card-bg rounded-lg shadow-md">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaRegFilePdf className="mr-3 text-gray-500" />
        {documentTitle}
      </h3>
      
      <CollapsibleSection title="Snippets" icon={<FaSearch />}>
        {getSnippets(doc)}
      </CollapsibleSection>

      <CollapsibleSection title="Extractive Answers" icon={<FaQuoteLeft />}>
        {getExtractiveAnswers(doc)}
      </CollapsibleSection>

      <CollapsibleSection title="Extractive Segments" icon={<FaListUl />}>
        {getExtractiveSegments(doc)}
      </CollapsibleSection>
    </div>
  );
};

const ResponseItem = ({ response }) => {
  if (!response || !response.results || response.results.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-6">
      {response.results.map((result, index) => (
        <SearchResponseItem key={result.document.id || index} result={result} />
      ))}
    </div>
  );
};

export default ResponseItem;