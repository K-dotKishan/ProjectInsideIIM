// frontend/src/components/NewsCard.jsx

/**
 * This component is responsible for displaying the list of news articles
 * fetched by the backend. It maps over the array of news items and renders
 * each one with its title, source, and a brief snippet.
 * This component demonstrates how to handle rendering lists of data in React.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ResultCard from './ResultCard';

// A helper component to render a single news article.
// This keeps the main NewsCard component clean and focused on list rendering.
function Article({ title, source, snippet }) {
  return (
    <div className="border-b border-gray-700 py-3 last:border-b-0">
      <h4 className="font-semibold text-blue-300">{title}</h4>
      <p className="mt-1 text-sm text-gray-400">{snippet}</p>
      <p className="mt-2 text-xs font-medium text-gray-500">{source}</p>
    </div>
  );
}

Article.propTypes = {
  title: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  snippet: PropTypes.string,
};


function NewsCard({ news }) {
  // If there's no news data or the array is empty, render a message.
  // This is good practice for handling edge cases in API responses.
  if (!news || news.length === 0) {
    return (
      <ResultCard title="Recent News">
        <p className="text-gray-400">No recent news articles found.</p>
      </ResultCard>
    );
  }

  return (
    <ResultCard title="Recent News">
      <div className="flex flex-col">
        {news.map((article, index) => (
          <Article
            key={index} // A unique key is required for list items in React for efficient rendering.
            title={article.title}
            source={article.source}
            snippet={article.snippet}
          />
        ))}
      </div>
    </ResultCard>
  );
}

NewsCard.propTypes = {
  // `arrayOf` and `shape` together define the expected structure for the news prop.
  news: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      snippet: PropTypes.string,
    })
  ).isRequired,
};

export default NewsCard;