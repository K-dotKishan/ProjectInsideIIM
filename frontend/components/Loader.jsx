// frontend/src/components/Loader.jsx

/**
 * A simple, reusable loading spinner component.
 * This component will be displayed whenever our application is in a loading state,
 * such as when it's waiting for the API response from the backend.
 * Creating this as a separate component follows the single-responsibility principle
 * and keeps our main page component cleaner.
 */
import React from 'react';

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-4 text-lg text-gray-400">
        AI agent is researching... Please wait.
      </p>
    </div>
  );
}

export default Loader;