import parse from "html-react-parser";
import { FaRegFilePdf, FaBookOpen, FaLightbulb, FaQuoteLeft, FaChartLine, FaInfoCircle } from 'react-icons/fa';

const ResponseItem = (props) => {
  const isLoading = props.response?.isLoading;

  if (isLoading) {
    // Handled by the modal in ParameterPanel, but could have a placeholder here too
    return null; 
  }
  
  if (!props.response || !props.response.results) {
    return (
      <div className="bg-card-bg rounded-lg shadow-md p-8 text-center text-text-muted">
        <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
        <p>Perform a search to see results here.</p>
        <p className="text-xs mt-1">Ensure you have entered a query in the search bar above and clicked "Search" in the parameters panel.</p>
      </div>
    );
  }

  if (props.response.results.length === 0) {
    return (
      <div className="bg-card-bg rounded-lg shadow-md p-8 text-center text-text-muted">
        <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
        <p>No results found for your query.</p>
        <p className="text-xs mt-1">Try refining your search terms or adjusting the parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {props.response.results.map((item, index) => (
        <div key={item.document?.id || `result-${index}`} className="bg-card-bg rounded-lg shadow-md p-6">
          {getFileName(item.document?.derivedStructData?.title)}
          {getReferences(props.response.summary?.summaryWithMetadata?.references)}
          {getSnippets(item.document?.derivedStructData?.snippets)}
          {getExtractiveAnswer(item.document?.derivedStructData?.extractive_answers)}
          {getExtractiveSegments(item.document?.derivedStructData?.extractive_segments)}
        </div>
      ))}
    </div>
  );
};

function getFileName(docTitle) {
  if (!docTitle) return null;
  const title = docTitle.toString().includes("docs/")
    ? docTitle.toString().split("/")[1]
    : docTitle.toString();
  return (
    <h3 className="text-xl font-semibold text-ayala-green-dark mb-3 flex items-center">
      <FaRegFilePdf className="mr-2 opacity-80 flex-shrink-0"/> {title}
    </h3>
  );
}

function getReferences(referenceItems) {
  if (!referenceItems || referenceItems.length === 0) return null;
  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider flex items-center">
        <FaBookOpen className="mr-2 opacity-75"/> References
      </h4>
      <div className="space-y-2">
        {referenceItems.map((item, index) => (
          <div key={`ref-${index}`} className="text-xs text-text-secondary bg-page-bg p-2 rounded-md">
            <span className="font-semibold text-ayala-green">Page {item.chunkContents?.[0]?.pageIdentifier || 'N/A'}:</span> {item.chunkContents?.[0]?.content || 'No content available.'}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSnippets(snippetItems) {
  if (!snippetItems || snippetItems.length === 0) return null;
  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider flex items-center">
         <FaLightbulb className="mr-2 opacity-75"/> Snippets
      </h4>
      <div className="space-y-3">
        {snippetItems.map((item, index) => (
          <div key={`snippet-${index}`} className="text-sm text-text-secondary leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-a:text-ayala-green hover:prose-a:text-ayala-green-dark">
            {parse(item.snippet)}
          </div>
        ))}
      </div>
    </div>
  );
}

function getExtractiveAnswer(extractiveAnswerItems) {
  if (!extractiveAnswerItems || extractiveAnswerItems.length === 0) return null;
  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider flex items-center">
        <FaQuoteLeft className="mr-2 opacity-75"/> Extractive Answers
      </h4>
      <div className="space-y-3">
        {extractiveAnswerItems.map((item, index) => (
          <div key={`answer-${index}`} className="bg-ayala-green-light/10 p-4 rounded-lg border-l-4 border-ayala-green-light">
            <p className="text-xs text-ayala-green-dark font-medium mb-1">Page {item.pageNumber}</p>
            <p className="text-sm text-text-primary">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getExtractiveSegments(extractiveSegmentItems) {
  if (!extractiveSegmentItems || extractiveSegmentItems.length === 0) return null;
  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider flex items-center">
        <FaChartLine className="mr-2 opacity-75"/> Extractive Segments
      </h4>
      <div className="space-y-3">
        {extractiveSegmentItems.map((item, index) => (
          <div key={`segment-${index}`} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-ayala-green-dark">
                Page {item.pageNumber}
              </span>
              {item.relevanceScore && (
                <span className="text-xs font-medium text-ayala-green bg-ayala-green-light/20 px-2 py-0.5 rounded-full">
                  Relevance: {item.relevanceScore.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponseItem;
