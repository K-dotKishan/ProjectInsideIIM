// frontend/src/components/AnalysisResult.jsx

/**
 * This is the main component for displaying the entire analysis dashboard.
 * It acts as a container that orchestrates the layout and rendering of all
 * the smaller, specialized components (ResultCard, FinancialsCard, NewsCard).
 * Receiving the full analysis object as a prop, it passes down the relevant
 * pieces of data to each child component. This is a great example of the
 * "container-component" pattern.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ResultCard from './ResultCard';
import FinancialsCard from './FinancialsCard';
import NewsCard from './NewsCard';

// A helper component to render the recommendation badge with dynamic styling.
function RecommendationBadge({ recommendation, confidence }) {
  const badgeStyles = {
    BUY: 'bg-green-600 text-green-100',
    HOLD: 'bg-yellow-600 text-yellow-100',
    PASS: 'bg-red-600 text-red-100',
  };

  return (
    <div className="text-center">
      <span
        className={`inline-block rounded-full px-6 py-2 text-2xl font-bold uppercase tracking-wider ${badgeStyles[recommendation] || 'bg-gray-600'}`}
      >
        {recommendation}
      </span>
      <p className="mt-2 text-sm text-gray-400">Confidence: {confidence}%</p>
    </div>
  );
}

RecommendationBadge.propTypes = {
    recommendation: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
};


function AnalysisResult({ result }) {
  if (!result) return null;

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold">{result.companyName} ({result.ticker})</h2>
        <p className="mt-2 text-lg text-gray-400">{result.summary}</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <ResultCard title="Investment Thesis & Reasoning">
            <p className="whitespace-pre-wrap text-gray-300">{result.reasoning}</p>
          </ResultCard>
          <NewsCard news={result.news} />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1">
          <ResultCard title="Recommendation">
            <RecommendationBadge recommendation={result.recommendation} confidence={result.confidenceScore} />
          </ResultCard>
          <FinancialsCard financials={result.financials} />
          <ResultCard title="Strengths">
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              {result.strengths.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </ResultCard>
          <ResultCard title="Risks">
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              {result.risks.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </ResultCard>
        </div>
      </div>
    </div>
  );
}

AnalysisResult.propTypes = {
  // `PropTypes.object` can be used here, but a detailed `shape` is better
  // for documentation and debugging.
  result: PropTypes.shape({
    companyName: PropTypes.string,
    ticker: PropTypes.string,
    summary: PropTypes.string,
    reasoning: PropTypes.string,
    recommendation: PropTypes.string,
    confidenceScore: PropTypes.number,
    financials: PropTypes.object,
    news: PropTypes.array,
    strengths: PropTypes.arrayOf(PropTypes.string),
    risks: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AnalysisResult;