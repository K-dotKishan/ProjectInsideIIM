// frontend/src/services/apiService.js

/**
 * This service module centralizes all API communication logic.
 * By using Axios, we create a configured instance that knows our backend's
 * base URL. This is a best practice because:
 * 1.  It's DRY (Don't Repeat Yourself): We don't have to type the full URL
 *     in every component that needs to make an API call.
 * 2.  It's Maintainable: If the API address changes, we only need to update
 *     it in this one file.
 * 3.  It's Clean: It separates the concern of data fetching from the UI
 *     components, making them cleaner and more focused on rendering.
 */
import axios from 'axios';

// Get the backend API URL from environment variables.
// Vite uses `VITE_` prefix for environment variables to be exposed to the client.
// We provide a fallback for local development.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create a new Axios instance with a predefined base URL.
// All requests made with this instance will be prefixed with the API_URL.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A function to call the company analysis endpoint.
 * @param {string} company - The name of the company to be analyzed.
 * @returns {Promise<object>} A promise that resolves to the analysis data.
 * @throws {Error} Throws an error if the API call fails or returns an error.
 */
export const getAnalysis = async (company) => {
  try {
    // Make a POST request to the '/analyze' endpoint.
    console.log(`[ApiService] Sending request for company: "${company}"`);
    const response = await apiClient.post('/analyze', { company });

    // Axios wraps the response in a `data` object. We check for our
    // custom `success` flag from the backend controller.
    if (response.data && response.data.success) {
      console.log(`[ApiService] Received successful analysis.`);
      return response.data.data;
    } else {
      // If the backend signals an error, we throw it to be caught by the UI layer.
      throw new Error(response.data.error || 'An unknown error occurred.');
    }
  } catch (error) {
    // This block handles network errors or errors thrown from the above check.
    console.error('[ApiService] Error fetching analysis:', error);
    
    // We re-throw a user-friendly error message that the UI can display.
    // If the error has a response from the server, we use that message.
    const errorMessage = error.response?.data?.error || error.message || 'Failed to connect to the server.';
    throw new Error(errorMessage);
  }
};