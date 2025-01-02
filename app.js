const express = require('express');
const todoRoutes = require('./routes/tododb.js');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// Pertemuan 7
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');



const expressLayout = require('express-ejs-layouts');

const db = require('./database/db');

app.use(expressLayout);

app.use(express.json());

app.use('/todos', todoRoutes);

app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false} // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);

app.set('view engine', 'ejs');

app.get('/admin/transaksi', isAuthenticated, (req, res) => {
    res.render('admin/transaksi', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/admin/bundling', isAuthenticated, (req, res) => {
    res.render('admin/bundling', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/admin/delete', isAuthenticated, (req, res) => {
    res.render('admin/delete', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/admin/createbundling', isAuthenticated, (req, res) => {
    res.render('admin/createbundling', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/', isAuthenticated, (req, res) => {
    res.render('customer/index', {
        layout: 'layouts/main-layouts.ejs'
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