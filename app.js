const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Session Resmi
app.use(session({
  secret: 'rahasia-kampus-paling-aman',
  resave: false,
  saveUninitialized: true
}));

// Import rute modular terpisah
const pesanRouter = require('./routes/pesan');
const authRouter = require('./routes/auth');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gunakan rute modular
app.use('/', pesanRouter);
app.use('/', authRouter);

// Rute utama (root) langsung diarahkan ke halaman login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Rute Halaman Kontak HTML
app.get('/kontak', (req, res) => {
  res.sendFile(path.join(__dirname, 'kontak.html'));
});

app.listen(PORT, () => {
  console.log(`Server cloud-ready aktif di port ${PORT}`);
});