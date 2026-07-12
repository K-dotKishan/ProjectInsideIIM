// backend/tools/searchTool.js

/**
 * This file defines a general-purpose search tool using the Tavily Search API client.
 * Its primary roles in our agent are:
 * 1. To find the official stock ticker for a company when the user provides only a name.
 * 2. To gather a high-level company overview or summary.
 * This tool acts as the initial information-gathering step, providing the necessary
 * ticker symbol that other, more specific tools (like yahooFinanceTool) require.
 */

const { tool } = require("langchain/tools");
const z = require("zod");
const { tavilySearch } = require("../utils/apiClients");

const searchTool = tool(
  async ({ query }) => {
    try {
      console.log(`[SearchTool] Performing web search for query: "${query}"`);

      // Invoke the Tavily search client with the required object shape.
      const response = await tavilySearch.invoke({ query });

      // TavilySearch returns an object with a `results` array.
      // Convert it to a readable string for the LLM.
      if (!response || (!response.results && !response.answer)) {
        console.warn(`[SearchTool] No search results found for: "${query}"`);
        return `No information found for the query: "${query}".`;
      }

      // Build a plain-text summary from the results
      let summary = '';
      if (response.answer) {
        summary += response.answer + '\n\n';
      }
      if (response.results && response.results.length > 0) {
        summary += response.results
          .slice(0, 5)
          .map(r => `${r.title}: ${r.content}`)
          .join('\n');
      }

      console.log(`[SearchTool] Successfully found search results for "${query}"`);
      return summary || `No relevant results for "${query}".`;

    } catch (error) {
      console.error(`[SearchTool] Error during web search for "${query}":`, error.message);
      return `Failed to perform web search for query "${query}". Error: ${error.message}.`;
    }
  },
  {
    name: "web_search",
    description: "Performs a web search using Tavily Search API to find company information, such as their official stock ticker, a company overview, or answers to specific questions.",
    schema: z.object({
      query: z.string().describe("The search query. For example, 'What is the stock ticker for Apple?' or 'NVIDIA company overview'."),
    }),
  }
);

module.exports = {
  searchTool
};