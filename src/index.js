const express = require('express');
const apiRoutes = require('./route/api');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Validasi CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Data khusus parhan
app.use('/api/data', (req, res, next) => {
  const key = req.query.key;
  if (!key || key !== config.API_KEY) {
    return res.status(403).json({ Error: "Apikeynya mana bang?!" });
  }
  next();
});
// Route API
app.use('/api', apiRoutes);
// Swagger UI
app.use('/docs', express.static('node_modules/swagger-ui-dist'), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
