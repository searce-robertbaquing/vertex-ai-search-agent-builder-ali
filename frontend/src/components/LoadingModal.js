import React from "react";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300">
      <div className="bg-card-bg rounded-lg p-8 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div> {/* Spinner color styled via index.css */}
        <p className="text-text-secondary text-lg">Searching documents...</p>
        <p className="text-text-muted text-sm mt-1">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default LoadingModal;
