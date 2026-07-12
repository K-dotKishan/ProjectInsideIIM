// backend/routes/analysisRoutes.js

/**
 * This file defines the specific API endpoints related to analysis.
 * We use the Express Router to create a modular set of routes that can be
 * imported and used by our main server file (`server.js`).
 *
 * This approach keeps our routing organized. If we had more endpoints
 * (e.g., for user authentication or historical data), we would create
 * separate route files for them.
 */

const express = require('express');
const { analyzeCompany } = require('../controllers/analysisController');

// Create a new router instance from Express.
const router = express.Router();

// Define the route for our primary functionality.
// When a POST request is made to '/api/analyze', it will be handled
// by the 'analyzeCompany' function from our controller.
//
// POST /api/analyze
// Request Body: { "company": "NVIDIA" }
// Response: The full JSON analysis from the agent.
router.post('/analyze', analyzeCompany);

module.exports = router;