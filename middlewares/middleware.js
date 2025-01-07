// Middleware untuk memeriksa autentikasi
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Middleware untuk memeriksa apakah pengguna adalah admin
function isAdmin(req, res, next) {
    // Asumsikan bahwa peran admin disimpan dalam session sebagai req.session.role
    if (req.session.role === 'admin') {
        return next(); // Lanjutkan ke rute berikutnya jika admin
    } else {
        res.redirect('/'); // Alihkan ke halaman utama jika bukan admin
    }
}

// Ekspor kedua middleware
module.exports = { isAuthenticated, isAdmin };
