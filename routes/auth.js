const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

// Fungsi helper untuk membaca file users.json
const getUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (e) {
    return [];
  }
};

// 1. Tampilkan Halaman Register (GET)
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// 2. Proses Simpan Register (POST)
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();

  // Cek apakah username sudah dipakai
  const userAda = users.find(u => u.username === username);
  if (userAda) {
    return res.send(`<h1>Registrasi Gagal!</h1><p>Username '${username}' sudah digunakan.</p><a href="/register">Coba Lagi</a>`);
  }

  // Simpan user baru ke array & tulis ke users.json
  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send(`<h1>Registrasi Berhasil! 🎉</h1><p>Akun ${username} sudah tersimpan permanen.</p><a href="/login">Silakan Login di Sini</a>`);
});

// 3. Tampilkan Halaman Login (GET)
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// 4. Proses Login (POST) & Set Session
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();

  // Cek apakah cocok dengan data di users.json ATAU akun default admin
  const validUser = users.find(u => u.username === username && u.password === password) || 
                    (username === "admin" && password === "12345");

  if (validUser) {
    // Simpan status login di session server
    req.session = req.session || {};
    req.session.user = username;

    res.send(`
      <h1>Selamat datang kembali, ${username}! 🚀</h1>
      <p>Login Berhasil dan session aktif.</p>
      <a href="/pesan">Lihat Daftar Pesan (Dilindungi)</a> | 
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`<h1>Login Gagal! ❌</h1><p>Username atau password salah.</p><a href="/login">Coba Lagi</a>`);
  }
});

// 5. Rute Logout (Hapus Session)
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  res.send(`<h1>Anda telah berhasil logout.</h1><a href="/login">Login Kembali</a>`);
});

module.exports = router;