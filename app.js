const express = require('express');
const transaksiRoutes = require('./routes/transaksidb.js');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// Pertemuan 7
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use('/uploads', express.static('uploads'));

const expressLayout = require('express-ejs-layouts');

const db = require('./database/db');

app.use(expressLayout);

app.use(express.json());

app.use('/transaksi', transaksiRoutes);

app.use(express.urlencoded({ extended: true }));

// Menghapus transaksi berdasarkan ID
app.delete('/admin/delete/:id', (req, res) => {
    const transaksiID = req.params.id;

    // Query untuk menghapus transaksi dari database
    const query = 'DELETE FROM transaksi WHERE ID_Transaksi = ?';
    
    db.query(query, [transaksiID], (err, result) => {
        if (err) {
            return res.status(500).send('Terjadi kesalahan saat menghapus transaksi');
        }

        res.send('Transaksi berhasil dihapus');
    });
});

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false} // Set ke true jika menggunakan HTTPS
}));

app.get('/admin/transaksi', (req, res) => {
    const query = 'SELECT * FROM transaksi'; // Query untuk mengambil data transaksi
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      res.json(results); // Kirim data transaksi ke frontend
    });
  });

app.use('/', authRoutes);

app.set('view engine', 'ejs');

app.get('/admin/transaksi', isAuthenticated, (req, res) => {
    res.render('admin/transaksi', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/admin/bundling', isAuthenticated, (req, res) => {
    res.render('admin/bundling', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/admin/editbundling', isAuthenticated, (req, res) => {
    res.render('admin/editbundling', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/admin/delete', isAuthenticated, (req, res) => {
    res.render('admin/delete', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/admin/createbundling', isAuthenticated, (req, res) => {
    res.render('admin/createbundling', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});


app.get('/admin/deletebundling', isAuthenticated, (req, res) => {
    res.render('admin/deletebundling', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/', isAuthenticated, (req, res) => {
    res.render('admin/transaksi', {
        layout: 'layouts/main-layoutadmin.ejs'
    });
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('customer/contact', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/todo-view', isAuthenticated,  (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layouts.ejs',
            todos: todos
        });
    });
});

app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});