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
      url: 'https://api-ureshii.vercel.app/swagger.json',
    },
    customCss: `
      /* Sembunyikan topbar untuk desain minimalis */
      .swagger-ui .topbar { 
        display: none; 
      }
      /* Menyesuaikan elemen tombol dan kolom deskripsi */
      .swagger-ui .opblock .opblock-summary-path-description-wrapper { 
        align-items: center; 
        display: flex; 
        flex-wrap: wrap; 
        gap: 10px 20px;
        padding: 10px; 
        width: 100%; 
      }
      /* Warna dan padding untuk summary */
      .swagger-ui .opblock-summary {
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      /* Menghilangkan tombol copy-to-clipboard */
      .swagger-ui .opblock-summary .copy-to-clipboard { 
        display: none; 
      }
      /* Responsif untuk API method block */
      .swagger-ui .opblock-body {
        padding: 20px !important;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      /* Mengatur responsif untuk body response */
      .swagger-ui .response-body {
        max-width: 100% !important;
        overflow: hidden !important;
        padding: 15px !important;
        box-sizing: border-box;
        background-color: #282828;
        border-radius: 5px;
      }
      /* Modifikasi tabel dan teks di dalam Swagger UI */
      .swagger-ui .models {
        font-size: 14px;
      }
      .swagger-ui .model-box {
        border-radius: 5px;
      }
      /* Responsif di perangkat mobile */
      @media (max-width: 768px) {
        .swagger-ui .opblock-summary-path-description-wrapper {
          flex-direction: column;
        }
        .swagger-ui .opblock-summary {
          margin-bottom: 15px;
        }
      }
    `,
    customCssUrl: CSS_URL,
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  
