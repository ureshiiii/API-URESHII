import { queryDatabase } from '../db-mysql.js';

export const getData = async (req, res) => {
  try {
    const type = req.query.type || null;

    if (!type) {
      return res.json({
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
    }

    let response = { Info: "Databasenya aktif - Parhan :3", Kominfo: "Hacker jangan menyerang" };

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
};
