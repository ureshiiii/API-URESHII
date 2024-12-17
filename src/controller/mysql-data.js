import { queryDatabase } from '../db-mysql.js';

/** DATA PRIBADI **/
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
/** END DATA PRIBADI **/

/** CRUD DATA USER **/
export const createUser = async (username, email, hashedPassword) => {
    const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, hashedPassword];
    const [result] = await queryDatabase(query, values);
    return result.insertId;
};
export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const [rows] = await queryDatabase(query, [email]);
    return rows[0];
};
export const createProduct = async (userId, name, description, price, imageUrl) => {
    const query = 'INSERT INTO Products (user_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, name, description, price, imageUrl];
    const [result] = await queryDatabase(query, values);
    return result.insertId;
};
export const getProductsByUserId = async (userId) => {
    const query = 'SELECT * FROM Products WHERE user_id = ?';
    const [rows] = await queryDatabase(query, [userId]);
    return rows;
};
export const updateProduct = async (productId, name, description, price, imageUrl) => {
    const query = 'UPDATE Products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?';
    const values = [name, description, price, imageUrl, productId];
    const [result] = await queryDatabase(query, values);
    return result.affectedRows;
};
export const deleteProduct = async (productId) => {
    const query = 'DELETE FROM Products WHERE id = ?';
    const [result] = await queryDatabase(query, [productId]);
    return result.affectedRows;
};
/** END CRUD DATA USER**/
