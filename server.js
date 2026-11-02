const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing body dari form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Konfigurasi Express Session
app.use(session({
    secret: 'rahasia-proyek-server-pertamaku',
    resave: false,
    saveUninitialized: true
}));

// Menyediakan static files dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROUTING MANUAL HALAMAN HTML (PUBLIC)
// ==========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/pesan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pesan.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// ==========================================
// IMPORT ROUTES API / BACKEND
// ==========================================
const authRouter = require('./routes/auth');
const pesanRouter = require('./routes/pesan');

app.use('/', authRouter);
app.use('/', pesanRouter);

// Menjalankan server lokal (untuk di komputer lokal)
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});