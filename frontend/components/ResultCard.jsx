// frontend/src/components/ResultCard.jsx

/**
 * A generic, reusable card component for displaying sections of the analysis.
 * This is a foundational UI component that provides a consistent look and feel
 * for different pieces of data (e.g., financials, strengths, risks).
 * It accepts a title and uses `children` prop to render any content inside it,
 * making it extremely flexible. This pattern is key to building modular and
 * maintainable React UIs.
 */
import React from 'react';
import PropTypes from 'prop-types';

function ResultCard({ title, children }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/60 shadow-lg backdrop-blur-sm">
      <div className="border-b border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

ResultCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ResultCard;