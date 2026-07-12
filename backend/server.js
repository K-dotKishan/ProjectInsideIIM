// backend/server.js

/**
 * This is the main entry point for our Express backend application.
 * Its role is to configure and start the server, wire up middleware,
 * and mount the various API routes from our modular route files.
 */

// Load environment variables from a .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import our modular routes
const analysisRoutes = require('./routes/analysisRoutes');

// Create an instance of the Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS to allow our frontend to communicate with this backend.
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies.
app.use(express.json());

// --- API Routes ---
// Mount our analysis routes under the '/api' namespace.
// Any request starting with '/api' will be handled by the analysisRoutes router.
// For example, a POST request to '/api/analyze' will be processed.
app.use('/api', analysisRoutes);


// --- Root Route for Health Check ---
// A simple GET route on the root path to easily check if the server is up and running.
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AI Investment Research Agent API is running.'
    });
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
