// backend/tools/yahooFinanceTool.js

/**
 * This file defines a structured tool for fetching financial data using the
 * yahoo-finance2 library. Creating this as a LangChain "Tool" allows our
- * LangGraph agent to call it predictably and use its output. The tool has a
 * clear schema for its inputs (a stock ticker) and a defined purpose, which
 * helps the AI agent understand when and how to use it.
 */

const { tool } = require("langchain/tools");
const z = require("zod");
const YahooFinance = require('yahoo-finance2').default;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const yahooFinanceTool = tool(
  async ({ ticker }) => {
    try {
      console.log(`[YahooFinanceTool] Fetching financial data for ticker: ${ticker}`);

      // Fetch the quote data for the specified ticker.
      const quote = await yahooFinance.quote(ticker);

      // If the API returns no data for a valid ticker, it can be problematic.
      // We check for the presence of a key metric like marketCap.
      if (!quote || !quote.marketCap) {
        console.warn(`[YahooFinanceTool] No data returned for ticker: ${ticker}`);
        return `No financial data found for ticker ${ticker}. The ticker might be invalid or delisted.`;
      }

      // Format the raw data into a clean, LLM-friendly string.
      // This step is critical. We select and label the most important data points
      // so the LLM can easily parse and understand the information.
      const formattedData = {
        symbol: quote.symbol,
        companyName: quote.longName || quote.shortName,
        currentPrice: `${quote.regularMarketPrice} ${quote.currency}`,
        marketCap: `${(quote.marketCap / 1e9).toFixed(2)}B ${quote.currency}`,
        priceToEarningsRatio: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
        earningsPerShare: quote.epsTrailingTwelveMonths ? quote.epsTrailingTwelveMonths.toFixed(2) : 'N/A',
        fiftyTwoWeekRange: `${quote.fiftyTwoWeekLow} - ${quote.fiftyTwoWeekHigh}`,
        averageVolume: quote.averageDailyVolume3Month,
        dividendYield: quote.dividendYield ? `${(quote.dividendYield * 100).toFixed(2)}%` : 'N/A',
      };
      
      console.log(`[YahooFinanceTool] Successfully fetched data for ${ticker}`);
      return JSON.stringify(formattedData);

    } catch (error) {
      // Handle errors, such as an invalid ticker or network issues.
      // Providing a clear error message is important for debugging the agent's behavior.
      console.error(`[YahooFinanceTool] Error fetching data for ticker ${ticker}:`, error.message);
      return `Failed to fetch financial data for ticker ${ticker}. Error: ${error.message}. Please ensure the ticker is correct.`;
    }
  },
  {
    name: "get_financial_data",
    description: "Fetches key financial metrics for a given stock ticker from Yahoo Finance. Use this to get stock price, market cap, P/E ratio, and other essential financial data.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol of the company (e.g., 'AAPL' for Apple)."),
    }),
  }
);

module.exports = {
  yahooFinanceTool
};