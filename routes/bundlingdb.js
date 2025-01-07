// routes/bundlingdb.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database/db'); // Pastikan path ini sesuai dengan file koneksi database Anda

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Folder tujuan untuk menyimpan file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik berdasarkan timestamp
    }
});

const upload = multer({ storage: storage });

// Route untuk membuat bundling baru
router.post('/admin/createbundling', upload.single('image'), (req, res) => {
    const { bundleName, bundlePrice, description, destination } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validasi input
    if (!bundleName || !bundlePrice || !description || !destination || !image) {
        return res.status(400).send('Semua field harus diisi!');
    }

    // Query SQL untuk menyimpan data ke database
    const query = `
        INSERT INTO paketbundling (Nama_paket, Harga, Deskripsi, Gambar, Lokasi) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [bundleName, bundlePrice, description, image, destination];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting bundling:', err);
            return res.status(500).send('Gagal menyimpan bundling.');
        }

        res.redirect('/admin/bundling'); // Redirect ke halaman bundling setelah sukses
    });
});

// Endpoint untuk mendapatkan semua data bundling
router.get('/admin/bundling', (req, res) => {
    const query = `
        SELECT ID_Paket, Nama_paket, Deskripsi, Gambar, Harga
        FROM paketbundling
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching bundling data: ', err);
            return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        }
        console.log('Results from database:', results); // Log hasil query
        res.json(results); // Mengembalikan data dalam format JSON
    });
});

// Endpoint untuk menghapus bundling berdasarkan ID
router.post('/admin/deletebundling/:id', (req, res) => {
    const id = req.params.id;

    // Query untuk menghapus data berdasarkan ID
    const query = 'DELETE FROM paketbundling WHERE ID_Paket = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menghapus bundling.');
        }

        res.redirect('/admin/bundling'); // Redirect ke halaman bundling setelah penghapusan
    });
});

// Route untuk mengupdate bundling berdasarkan ID
router.post('/admin/editbundling/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { bundleName, bundlePrice, description, destination } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validasi input
    if (!bundleName || !bundlePrice || !description || !destination) {
        return res.status(400).send('Semua field harus diisi!');
    }

    // Query untuk update data
    let query = `
        UPDATE paketbundling
        SET Nama_paket = ?, Harga = ?, Deskripsi = ?, Lokasi = ?
    `;
    const values = [bundleName, bundlePrice, description, destination];

    // Tambahkan gambar jika ada file baru yang diunggah
    if (image) {
        query += `, Gambar = ?`;
        values.push(image);
    }

    query += ` WHERE ID_Paket = ?`;
    values.push(id);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating bundling:', err);
            return res.status(500).send('Gagal mengupdate bundling.');
        }

        res.redirect('/admin/bundling'); // Redirect ke halaman bundling setelah update sukses
    });
});



// Export router untuk digunakan di aplikasi utama
module.exports = router;
