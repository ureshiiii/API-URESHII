import { queryDatabase } from '../db-mysql.js';

export const createProduct = async (req, res) => {
  try {
    const { userId, nama_produk, harga, icon, id_layanan } = req.body;

    if (!userId || !nama_produk || !harga || !icon || !id_layanan) {
      return res.status(400).json({ message: 'Data produk tidak lengkap.' });
    }

    await queryDatabase(`
      INSERT INTO produk (user_id, nama_produk, harga, icon, id_layanan) 
      VALUES (?, ?, ?, ?, ?)
    `, [userId, nama_produk, harga, icon, id_layanan]);

    res.status(201).json({ message: 'Produk berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan produk.', error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const dataProduk = await queryDatabase(`
      SELECT p.id_produk, p.nama_produk, p.harga, p.icon, l.nama_layanan
      FROM produk p
      INNER JOIN layanan l ON p.id_layanan = l.id_layanan
      WHERE p.user_id = ? 
      ORDER BY p.id_produk ASC
    `, [userId]);

    res.json({ dataProduk });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk.', error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const dataProduk = await queryDatabase(`
      SELECT p.id_produk, p.nama_produk, p.harga, p.icon, l.nama_layanan
      FROM produk p
      INNER JOIN layanan l ON p.id_layanan = l.id_layanan
      WHERE p.id_produk = ?
    `, [productId]);

    if (dataProduk.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    res.json({ dataProduk: dataProduk[0] });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data produk.', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { nama_produk, harga, icon, id_layanan } = req.body;

    if (!nama_produk || !harga || !icon || !id_layanan) {
      return res.status(400).json({ message: 'Data produk tidak lengkap.' });
    }

    await queryDatabase(`
      UPDATE produk 
      SET nama_produk = ?, harga = ?, icon = ?, id_layanan = ? 
      WHERE id_produk = ?
    `, [nama_produk, harga, icon, id_layanan, productId]);

    res.json({ message: 'Produk berhasil diupdate!' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate produk.', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await queryDatabase(`
      DELETE FROM produk 
      WHERE id_produk = ?
    `, [productId]);

    res.json({ message: 'Produk berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk.', error: err.message });
  }
};
