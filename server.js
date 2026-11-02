const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke MongoDB Atlas (Ganti URL di bawah dengan Connection String MongoDB milikmu nanti)
const MONGO_URI = process.env.MONGO_URI || 'MASUKKAN_CONNECTION_STRING_MONGODB_DI_SINI';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB Atlas!'))
    .catch(err => console.error('Koneksi MongoDB gagal:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'rahasia-proyek-server-pertamaku',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Routing Manual Halaman HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/pesan', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pesan.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

// Import Routes API
const authRouter = require('./routes/auth');
const pesanRouter = require('./routes/pesan');

app.use('/', authRouter);
app.use('/', pesanRouter);

// Jalankan server secara lokal (di laptop)
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

// Export app agar bisa dibaca oleh Vercel (Serverless)
module.exports = app;