// backend/controllers/analysisController.js

/**
 * The controller is the logical layer that handles incoming HTTP requests.
 * Its primary responsibilities are:
 * 1.  Input validation: Ensure the request body is correctly formatted.
 * 2.  Calling the business logic: In this case, invoking our LangGraph agent.
 * 3.  Error handling: Catching errors from the agent and sending back
 *     appropriate HTTP status codes and error messages.
 * 4.  Formatting the response: Sending the successful result back to the client
 *     in the expected JSON format.
 * This separation keeps our routing logic clean and our core agent logic reusable.
 */

const { investmentAgent } = require('../graph/workflow');

const analyzeCompany = async (req, res) => {
  // 1. Input Validation
  const { company } = req.body;

  if (!company || typeof company !== 'string' || company.trim() === '') {
    // If the company name is missing or invalid, send a 400 Bad Request response.
    return res.status(400).json({
      success: false,
      error: 'A valid company name is required in the request body.',
    });
  }

  try {
    console.log(`[Controller] Starting analysis for company: "${company}"`);

    // 2. Calling the Business Logic
    // We invoke the compiled LangGraph agent with the initial state.
    const initialState = { company };
    const finalState = await investmentAgent.invoke(initialState);

    // The final state of the graph contains all the accumulated data.
    // The most important piece is the 'analysis' from the last node.
    const analysisResult = finalState.analysis;

    if (!analysisResult) {
      // This is a safety check in case the graph finishes without producing an analysis.
      throw new Error("Analysis could not be completed.");
    }

    console.log(`[Controller] Successfully completed analysis for "${company}"`);
    
    // 4. Formatting the Response
    // Send a 200 OK response with the successful analysis data.
    res.status(200).json({
      success: true,
      data: analysisResult,
    });

  } catch (error) {
    // 3. Error Handling
    // Catch any errors thrown during the graph's execution.
    console.error(`[Controller] Error during analysis for "${company}":`, error.message);
    
    // Send a 500 Internal Server Error response.
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred on the server.',
    });
  }
};

module.exports = {
  analyzeCompany,
};