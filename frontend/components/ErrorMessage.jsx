// frontend/src/components/ErrorMessage.jsx

/**
 * A reusable component for displaying error messages.
 * This component is crucial for good user experience. Instead of the app
 * crashing or doing nothing on an error, we can show a clear message
 * to the user explaining what went wrong.
 * It accepts the error message as a prop, making it highly reusable.
 */
import React from 'react';
import PropTypes from 'prop-types';

function ErrorMessage({ message }) {
  // If no message is provided, don't render anything.
  if (!message) {
    return null;
  }

  return (
    <div
      className="m-4 rounded-lg border-l-4 border-red-600 bg-red-900/40 p-4 text-red-200"
      role="alert"
    >
      <p className="font-bold">An Error Occurred</p>
      <p>{message}</p>
    </div>
  );
}

// Using prop-types for runtime type checking in a JavaScript project.
// This is a best practice that helps catch bugs and ensures components are used correctly.
ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default ErrorMessage;