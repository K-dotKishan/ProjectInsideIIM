// frontend/src/pages/HomePage.jsx

/**
 * This is the primary page component for our application. It acts as the "brain"
 * of the frontend, managing all major pieces of state:
 * - `isLoading`: To track when an API call is in progress.
 * - `error`: To store any error messages from the API.
 * - `analysisResult`: To hold the successful analysis data from the backend.
 *
 * It renders the appropriate components (SearchForm, Loader, ErrorMessage,
 * or AnalysisResult) based on the current state, a pattern known as
 * "conditional rendering".
 */
import React, { useState } from 'react';
import { getAnalysis } from '../services/apiService';
import SearchForm from '../../components/SearchForm';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import AnalysisResult from '../../components/AnalysisResult';

function HomePage() {
  // --- State Management ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  /**
   * Handles the form submission event from the SearchForm component.
   * This function orchestrates the entire analysis process on the frontend.
   * @param {string} company - The company name entered by the user.
   */
  const handleAnalyze = async (company) => {
    // 1. Reset state for a new analysis
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      // 2. Call the API service
      const result = await getAnalysis(company);
      // 3. Update state with the successful result
      setAnalysisResult(result);
    } catch (err) {
      // 4. Update state with the error message if the API call fails
      setError(err.message);
    } finally {
      // 5. Ensure loading is turned off, whether the call succeeded or failed
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center p-4 pt-12">
      <SearchForm onAnalyze={handleAnalyze} isLoading={isLoading} />

      <div className="mt-8 w-full">
        {/* Conditional Rendering Logic */}
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {analysisResult && <AnalysisResult result={analysisResult} />}
      </div>
    </div>
  );
}

export default HomePage;