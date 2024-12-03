import express from 'express';
import apiRoutes from './route/api.js';
import config from './config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger.js'; 
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css"; 
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

// Middleware buat si swagger
app.use('/docs', (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (typeof body === 'string' && body.includes('<head>')) {
      body = body.replace('<head>', `<head><meta name="viewport" content="width=device-width, initial-scale=1">`);
    }
    originalSend.call(this, body);
  };
  next();
});

// Route API
app.use('/api', apiRoutes);
// Halaman dokumentasi
app.use('/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    layout: "StandaloneLayout",
    swaggerOptions: {
      url: 'https://api-ureshii.vercel.app/swagger.json' 
    },
    customCss: 
      `.swagger-ui .topbar { 
        display: none; 
      }
      .swagger-ui .opblock .opblock-summary-path-description-wrapper { 
        align-items: center; 
        display: flex; 
        flex-wrap: wrap; 
        gap: 0 10px;
        padding: 0 10px; 
        width: 100%; 
      }
      .swagger-ui .opblock-summary .copy-to-clipboard { 
        display: none; 
      }
      `,
    customCssUrl: CSS_URL,
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
