// routes/bundling.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Endpoint untuk mendapatkan semua transaksi
router.get('/admin/bundling', (req, res) => {
    const query = `
        SELECT ID_Paket, Nama_paket, Deskripsi, Gambar, Harga
        FROM paketbundling
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan pada server.');
        }
        res.json(results);
    });
});

// Menghapus bundling berdasarkan ID
router.delete('/admin/deletebundling/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM paketbundling WHERE ID_Paket = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting bundling: ', err);
            res.status(500).send('Database error');
        } else {
            res.status(200).send('Bundling deleted successfully');
        }
    });
});

module.exports = router;
