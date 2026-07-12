// backend/tools/newsTool.js

/**
 * This file defines a structured tool for fetching recent news articles
 * using the NewsAPI client. Like the Yahoo Finance tool, this standardizes
 * the input (a company name) and output, making it a reliable component
*  for our LangGraph agent. The agent will use this tool to gather qualitative
 * data, which is essential for understanding market sentiment and recent events
 * that financial numbers alone cannot capture.
 */

const { tool } = require("langchain/tools");
const z = require("zod");
const { newsapi } = require("../utils/apiClients");

const newsTool = tool(
  async ({ companyName }) => {
    try {
      console.log(`[NewsTool] Fetching news for company: ${companyName}`);

      // Perform the search using the NewsAPI client.
      // We search for the company name and filter for English articles,
      // sorted by relevance, and limit the results to a manageable number (5).
      const response = await newsapi.v2.everything({
        q: `${companyName} stock OR finance OR earnings`,
        language: 'en',
        sortBy: 'relevance',
        pageSize: 5
      });

      if (response.status !== 'ok' || response.articles.length === 0) {
        console.warn(`[NewsTool] No news articles found for: ${companyName}`);
        return `No recent news articles found for ${companyName}.`;
      }

      // Map over the raw API response to extract and format only the
      // essential information: title, source, and a brief description/snippet.
      // This pre-processing step is vital to keep the context fed to the LLM
      // clean, concise, and focused.
      const articles = response.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        snippet: article.description,
      }));

      console.log(`[NewsTool] Successfully fetched ${articles.length} articles for ${companyName}`);
      return JSON.stringify(articles);

    } catch (error) {
      // Handle potential API errors, such as rate limits or network failures.
      console.error(`[NewsTool] Error fetching news for ${companyName}:`, error.message);
      return `Failed to fetch news for ${companyName}. Error: ${error.message}.`;
    }
  },
  {
    name: "get_company_news",
    description: "Fetches recent news articles for a given company name. Use this to find out the latest developments, market sentiment, and important events related to the company.",
    schema: z.object({
      companyName: z.string().describe("The full name of the company (e.g., 'NVIDIA Corporation')."),
    }),
  }
);

module.exports = {
  newsTool
};