const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');

const router = express.Router();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder tempat menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Penamaan file unik
    }
});

const upload = multer({ storage: storage });

// Endpoint untuk menambahkan transaksi
router.post('/', upload.single('buktiPembayaran'), (req, res) => {
    const { id, idPaket, jumlahPembayaran } = req.body;
    const buktiPembayaranPath = req.file ? `uploads/${req.file.filename}` : null;

    if (!id || !idPaket || !jumlahPembayaran || !buktiPembayaranPath) {
        return res.status(400).send('Semua field wajib diisi!');
    }

    const query = `
        INSERT INTO transaksi (id, ID_Paket, Jumlah_Pembayaran, Bukti_Pembayaran)
        VALUES (?, ?, ?, ?)
    `;
    const values = [id, idPaket, jumlahPembayaran, buktiPembayaranPath];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan pada server.');
        }
        res.status(201).send('Transaksi berhasil ditambahkan.');
    });
});

// Endpoint untuk mendapatkan semua transaksi
router.get('/', (req, res) => {
    const query = `
        SELECT ID_Transaksi, id, ID_Paket, Jumlah_Pembayaran, Bukti_Pembayaran
        FROM transaksi
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan pada server.');
        }
        res.json(results);
    });
});

// Ekspor router
module.exports = router;
