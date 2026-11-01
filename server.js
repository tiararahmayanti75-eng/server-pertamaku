const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca data dari form POST & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Konfigurasi Session
app.use(session({
    secret: 'rahasia-negara-perpus-express',
    resave: false,
    saveUninitialized: true
}));

// Folder statis untuk file publik (HTML, CSS, dll)
app.use(express.static(path.join(__dirname, 'public')));

// Impor rute modular
const authRoutes = require('./routes/auth');
const pesanRoutes = require('./routes/pesan');

// Gunakan rute modular
app.use('/', authRoutes);
app.use('/', pesanRoutes);

// Langsung arahkan halaman utama ke halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Jalankan server lokal (hanya aktif jika tidak di Vercel / berjalan lokal)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan mulus di http://localhost:${PORT} 🚀`);
    });
}

// Ekspor aplikasi agar bisa dibaca oleh Vercel Serverless Function
module.exports = app;