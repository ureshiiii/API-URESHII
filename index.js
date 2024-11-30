const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const allowedOrigins = ["https://www.ureshii.my.id", "https://ureshii.my.id"];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

const API_KEY = process.env.API_KEY || "lovefirsha";
app.use((req, res, next) => {
  const key = req.query.key;
  if (!key || key !== API_KEY) {
    return res.status(403).json({ Error: "Apikeynya mana bang?!" });
  }
  next();
});

const dbConfig = {
  host: process.env.DB_HOST || "sql305.infinityfree.com",
  user: process.env.DB_USER || "if0_36039712",
  password: process.env.DB_PASS || "Qo1E1XszIq",
  database: process.env.DB_NAME || "if0_36039712_handata",
};

async function queryDatabase(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

app.get('/', async (req, res) => {
  const type = req.query.type || null;

  if (!type) {
    res.json({
      Info: "Databasenya aktif hann :3",
      Kominfo: "Hacker jangan menyerang",
      DataYangTersedia: [
        "donorData",
        "dataAkun",
        "totalSurvey",
        "totalAkun",
        "dataProduk",
        "dataButtons"
      ]
    });
  } else {
    try {
      let response = { Info: "Databasenya aktif hann :3", Kominfo: "Hacker jangan menyerang" };

      switch (type) {
        case 'donorData':
          response.donorData = await queryDatabase("SELECT * FROM donorData");
          break;
        case 'dataAkun':
          response.dataAkun = await queryDatabase("SELECT Id, Age, Username, role FROM users");
          break;
        case 'totalSurvey':
          const [totalSurvey] = await queryDatabase("SELECT COUNT(id) AS totalsurvey FROM responses");
          response.totalSurvey = totalSurvey.totalsurvey;
          break;
        case 'totalAkun':
          const [totalAkun] = await queryDatabase("SELECT COUNT(Id) AS totalakun FROM users");
          response.totalAkun = totalAkun.totalakun;
          break;
        case 'dataProduk':
          const dataProduk = await queryDatabase(`
            SELECT p.id_produk, p.nama_produk, p.harga, p.icon, l.nama_layanan
            FROM produk p
            INNER JOIN layanan l ON p.id_layanan = l.id_layanan
            ORDER BY p.id_produk ASC
          `);
          response.dataProduk = dataProduk.map(item => ({
            ...item,
            harga: Number(item.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
          }));
          break;
        case 'dataButtons':
          response.dataButtons = await queryDatabase("SELECT * FROM buttons");
          break;
        default:
          return res.status(400).json({ Error: "Error: pastikan parameter 'type' tersedia di list!" });
      }

      res.json(response);
    } catch (err) {
      res.status(500).json({ Error: "Terjadi kesalahan server", Detail: err.message });
    }
  }
});

module.exports = app;
            
