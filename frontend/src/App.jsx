// frontend/src/App.jsx

/**
 * This is the root component of our entire React application.
 * Its main responsibilities are to set up the global layout, background,
 * and render the primary page components. In a larger application, this
 * is where you would also set up routing (e.g., with React Router).
 * For our single-page application, its job is simple: render the HomePage.
 */
import React from 'react';
import HomePage from './pages/HomePage';

function App() {
  return (
    // This div sets the global background color and default text color for the app.
    <div className="min-h-screen bg-gray-900 text-white">
      <main>
        {/* Render our main page component */}
        <HomePage />
      </main>
    </div>
  );
}

export default App;