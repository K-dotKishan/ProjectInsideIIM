// frontend/src/components/SearchForm.jsx

/**
 * This component renders the main user input field and the "Analyze" button.
 * It manages its own internal state for the input field value.
 * When the form is submitted, it calls the `onAnalyze` function passed down
 * as a prop, delegating the actual API call logic to the parent component.
 * It also intelligently disables the form elements when the app is in a
 * loading state to prevent multiple submissions.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function SearchForm({ onAnalyze, isLoading }) {
  // State to hold the value of the company name input field.
  const [company, setCompany] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default browser form submission behavior.
    if (company.trim()) { // Only proceed if the input is not just whitespace.
      onAnalyze(company);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-lg bg-gray-800/50 p-6 shadow-2xl backdrop-blur-sm">
      <h2 className="mb-4 text-center text-2xl font-bold text-white">
        AI Investment Research Agent
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter a company name (e.g., 'Nvidia')"
            className="w-full flex-grow rounded-md border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            aria-label="Company Name"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
}

SearchForm.propTypes = {
  onAnalyze: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SearchForm;