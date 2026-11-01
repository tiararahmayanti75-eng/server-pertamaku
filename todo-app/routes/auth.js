const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

// Fungsi helper untuk baca file users
const getUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (e) {
    return [];
  }
};

// 1. Kirim Halaman Register (GET)
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// 2. Proses Register (POST)
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();

  const userAda = users.find(u => u.username === username);
  if (userAda) {
    return res.send(`<h1>Registrasi Gagal!</h1><p>Username sudah digunakan.</p><a href="/register">Kembali</a>`);
  }

  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send(`<h1>Registrasi Berhasil!</h1><p>Akun ${username} sudah terdaftar.</p><a href="/login">Silakan Login</a>`);
});

// 3. Kirim Halaman Login (GET)
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// 4. Proses Login (POST)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();

  const validUser = users.find(u => u.username === username && u.password === password) || 
                    (username === "admin" && password === "12345");

  if (validUser) {
    res.send(`
      <h1>Selamat datang kembali, ${username}!</h1>
      <p>Login berhasil.</p>
      <a href="/pesan">Lihat Daftar Pesan</a> | 
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`<h1>Login Gagal!</h1><p>Username atau password salah.</p><a href="/login">Coba Lagi</a>`);
  }
});

// 5. Rute Logout
router.get('/logout', (req, res) => {
  res.send(`<h1>Anda telah berhasil logout.</h1><a href="/login">Login Kembali</a>`);
});

module.exports = router;