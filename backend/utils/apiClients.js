// backend/utils/apiClients.js

/**
 * This module initializes and exports singleton clients for all external APIs.
 * Centralizing client instantiation here allows us to manage API keys and
 * configurations in one place, making the rest of the application cleaner.
 * It ensures we don't repeatedly create new clients for every request.
 */

// Load environment variables from a .env file into process.env
require('dotenv').config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { TavilySearch } = require("@langchain/tavily");
const NewsAPI = require('newsapi');

const createFallbackClient = (name, fallbackMessage) => ({
  invoke: async () => {
    console.warn(`[ApiClients] ${name} is unavailable: ${fallbackMessage}`);
    return fallbackMessage;
  },
});

let geminiClient = createFallbackClient(
  'Gemini',
  'Gemini API key is not configured. Please add GEMINI_API_KEY to the backend .env file.'
);

let tavilySearch = createFallbackClient(
  'Tavily',
  'Tavily API key is not configured. Please add TAVILY_API_KEY to the backend .env file.'
);

let newsapi = {
  v2: {
    everything: async () => ({ status: 'ok', articles: [] }),
  },
};

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    geminiClient = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
    });
  } catch (error) {
    console.warn(`[ApiClients] Gemini client could not be initialized: ${error.message}`);
    geminiClient = createFallbackClient('Gemini', error.message);
  }
}

if (process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'YOUR_TAVILY_API_KEY_HERE') {
  try {
    tavilySearch = new TavilySearch({
      apiKey: process.env.TAVILY_API_KEY,
    });
  } catch (error) {
    console.warn(`[ApiClients] Tavily search tool could not be initialized: ${error.message}`);
    tavilySearch = createFallbackClient('Tavily', error.message);
  }
}

if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'YOUR_NEWSAPI_KEY_HERE') {
  try {
    newsapi = new NewsAPI(process.env.NEWS_API_KEY);
  } catch (error) {
    console.warn(`[ApiClients] NewsAPI client could not be initialized: ${error.message}`);
    newsapi = {
      v2: {
        everything: async () => ({ status: 'ok', articles: [] }),
      },
    };
  }
}

module.exports = {
  geminiClient,
  tavilySearch,
  newsapi,
};