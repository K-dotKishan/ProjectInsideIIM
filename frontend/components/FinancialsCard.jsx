// frontend/src/components/FinancialsCard.jsx

/**
 * This component is specifically designed to display the financial metrics
 * in a clean, readable format. It receives the 'financials' object from the
 * analysis result and renders it inside a ResultCard.
 * By creating a dedicated component for this, we keep the main AnalysisResult
 * component from getting cluttered with formatting logic.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ResultCard from './ResultCard';

// A helper component for rendering a single financial metric row.
// This further modularizes the UI and ensures consistent styling for each metric.
function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700 py-2 last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono font-semibold text-white">{value || 'N/A'}</span>
    </div>
  );
}

MetricRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};


function FinancialsCard({ financials }) {
  return (
    <ResultCard title="Key Financials">
      <div className="flex flex-col">
        <MetricRow label="Current Price" value={financials.currentPrice} />
        <MetricRow label="Market Cap" value={financials.marketCap} />
        <MetricRow label="P/E Ratio" value={financials.priceToEarningsRatio} />
        <MetricRow label="EPS" value={financials.earningsPerShare} />
        <MetricRow label="Dividend Yield" value={financials.dividendYield} />
      </div>
    </ResultCard>
  );
}

FinancialsCard.propTypes = {
  // `shape` allows us to define the expected structure of the financials object.
  financials: PropTypes.shape({
    currentPrice: PropTypes.string,
    marketCap: PropTypes.string,
    priceToEarningsRatio: PropTypes.string,
    earningsPerShare: PropTypes.string,
    dividendYield: PropTypes.string,
  }).isRequired,
};

export default FinancialsCard;