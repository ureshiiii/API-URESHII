// Updated index.js with CORS validation disabled and improvements to handle potential 404 issues
const express = require('express');
const apiRoutes = require('./route/api');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

// CORS Middleware (Validation Disabled)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow multiple methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight request handling
  }
  next();
});

// API Key validation for /api/data
app.use('/api/data', (req, res, next) => {
  const key = req.query.key;
  if (!key || key !== config.API_KEY) {
    return res.status(403).json({ Error: "Invalid or missing API key." });
  }
  next();
});

// Route Handlers
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 Error Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ Error: "Route not found." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  
