// backend/graph/workflow.js

/**
 * This file defines the core AI agent logic using LangGraph.js.
 * A "graph" is a state machine that orchestrates the flow of data and logic.
 * Our graph has a defined state and several "nodes" which are functions that
 * operate on and modify that state. This approach makes complex AI workflows
 * manageable, debuggable, and extensible.
 *
 * Workflow Overview:
 * 1. Start: Receive the user's query (company name).
 * 2. find_ticker: Use the search tool to find the company's stock ticker.
 * 3. gather_information: Use the financial and news tools to collect data.
 * 4. run_analysis: Use the Gemini LLM with our custom prompt to analyze the data.
 * 5. End: The final state contains the complete analysis.
 */

const { StateGraph, END } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");

const { yahooFinanceTool } = require("../tools/yahooFinanceTool");
const { newsTool } = require("../tools/newsTool");
const { searchTool } = require("../tools/searchTool");
const { analystPrompt } = require("../prompts/analystPrompt");
const { geminiClient } = require("../utils/apiClients");

// --- 1. Define the State ---
// The state is an object that will be passed between nodes in the graph.
// Each node can read from and write to this state.
const agentState = {
  company: { value: null }, // The initial user query
  ticker: { value: null }, // The stock ticker found by the search tool
  financialData: { value: null }, // Data from Yahoo Finance
  newsData: { value: null }, // Data from NewsAPI
  analysis: { value: null }, // The final JSON analysis from the LLM
};

// --- 2. Define the Nodes ---
// Nodes are the building blocks of the graph. Each node is a function
// that performs a specific action.

// Node: find_ticker
// This node uses the general search tool to find the company's ticker.
const findTickerNode = async (state) => {
  console.log("[Workflow] Node: find_ticker");
  const { company } = state;
  const query = `What is the stock ticker for ${company}?`;
  const searchResult = await searchTool.invoke({ query });

  // A simple heuristic to extract the ticker from the search result.
  // A more robust implementation might use an LLM call for extraction.
  const tickerMatch = searchResult.match(/\b[A-Z]{1,5}\b/);
  const ticker = tickerMatch ? tickerMatch[0] : null;

  if (!ticker) {
    console.error(`[Workflow] Could not find a ticker for ${company}`);
    throw new Error(`Could not determine a stock ticker for "${company}". Please be more specific.`);
  }

  console.log(`[Workflow] Found ticker: ${ticker}`);
  return { ticker };
};

// Node: gather_information
// This node runs the specialized tools in parallel to gather data.
const gatherInformationNode = async (state) => {
  console.log("[Workflow] Node: gather_information");
  const { company, ticker } = state;
  
  // Invoke the financial and news tools simultaneously.
  const [financialData, newsData] = await Promise.all([
    yahooFinanceTool.invoke({ ticker }),
    newsTool.invoke({ companyName: company }),
  ]);

  return { financialData, newsData };
};

// Node: run_analysis
// This is the final node where the LLM performs its analysis.
const runAnalysisNode = async (state) => {
  console.log("[Workflow] Node: run_analysis");
  const { financialData, newsData } = state;
  
  // Format the collected data into the prompt template.
  const formattedPrompt = analystPrompt
    .replace('{financialData}', financialData)
    .replace('{newsData}', newsData);

  // Invoke the Gemini client with the completed prompt.
  const response = await geminiClient.invoke(formattedPrompt);
  
  // The LLM should return a JSON string. We need to parse it.
  try {
    // Clean the response to remove potential markdown formatting.
    const jsonString = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonString);
    return { analysis };
  } catch (e) {
    console.error("[Workflow] Error parsing LLM JSON response:", e);
    throw new Error("The analysis from the AI was not in the correct format. Please try again.");
  }
};


// --- 3. Construct the Graph ---
const workflow = new StateGraph({
  channels: agentState,
});

// Add the nodes to the graph
workflow.addNode("find_ticker", findTickerNode);
workflow.addNode("gather_information", gatherInformationNode);
workflow.addNode("run_analysis", runAnalysisNode);

// --- 4. Define the Edges ---
// Edges define the flow of control between the nodes.

workflow.setEntryPoint("find_ticker");
workflow.addEdge("find_ticker", "gather_information");
workflow.addEdge("gather_information", "run_analysis");
workflow.addEdge("run_analysis", END); // The graph finishes after the analysis is run.

// --- 5. Compile the Graph ---
const investmentAgent = workflow.compile();

console.log("Investment Agent workflow compiled successfully.");

module.exports = {
  investmentAgent
};
