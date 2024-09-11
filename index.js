const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke database MySQL menggunakan environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    return;
  }
  console.log('Koneksi ke database berhasil!');
});

// Middleware CORS, menggunakan environment variable untuk allowed origins
const allowedOrigins = [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// API key (kunci API) juga dipindahkan ke environment variables
const kunciApi = process.env.API_KEY || 'lovefirsha';  // Default jika tidak ada env var

// Middleware untuk validasi API key
app.use((req, res, next) => {
  const apiKey = req.query.key;
  if (!apiKey || apiKey !== kunciApi) {
    return res.status(403).json({ Error: 'Apikeynya mana bang?!' });
  }
  next();
});

// Fungsi untuk menangani GET request
app.get('/', (req, res) => {
  const type = req.query.type;

  if (!type) {
    // Menampilkan daftar data yang tersedia
    const availableDataTypes = ['donorData', 'dataAkun', 'totalSurvey', 'totalAkun', 'imgTesti'];
    res.json({
      Info: 'Databasenya aktif hann :3',
      Kominfo: 'Hacker jangan menyerang',
      DataYangTersedia: availableDataTypes
    });
  } else {
    // Routing untuk berbagai tipe data
    switch (type) {
      case 'donorData':
        db.query('SELECT * FROM donorData', (err, results) => {
          if (err) {
            return res.status(500).json({ Error: 'Gagal mengambil data donor' });
          }
          res.json({ donorData: results });
        });
        break;

      case 'dataAkun':
        db.query('SELECT Id, Age, Username, role FROM users', (err, results) => {
          if (err) {
            return res.status(500).json({ Error: 'Gagal mengambil data akun' });
          }
          res.json({ dataAkun: results });
        });
        break;

      case 'totalSurvey':
        db.query('SELECT COUNT(id) AS totalsurvey FROM responses', (err, results) => {
          if (err) {
            return res.status(500).json({ Error: 'Gagal menghitung survei' });
          }
          res.json({ totalSurvey: results[0].totalsurvey });
        });
        break;

      case 'totalAkun':
        db.query('SELECT COUNT(Id) AS totalakun FROM users', (err, results) => {
          if (err) {
            return res.status(500).json({ Error: 'Gagal menghitung akun' });
          }
          res.json({ totalAkun: results[0].totalakun });
        });
        break;

      case 'imgTesti':
        const imgTesti = [
          { url: 'https://example.com/image1.jpg', bulan: 'January', tahun: '2024', tanggal: 1 },
          { url: 'https://example.com/image2.jpg', bulan: 'February', tahun: '2024', tanggal: 5 }
        ];
        res.json({ imgTesti });
        break;

      default:
        res.status(400).json({ Error: "Invalid, parameter 'type' gada" });
        break;
    }
  }

});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
