const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

const getUsers = () => {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data || '[]');
};

// Rute Login (GET)
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Proses Login dengan Role
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = username;
        // Tentukan role: misal username 'admin' otomatis jadi admin, sisanya user biasa
        req.session.role = (username.toLowerCase() === 'admin') ? 'admin' : 'user';
        res.redirect('/pesan');
    } else {
        res.redirect('/login?error=Username atau password salah!');
    }
});

// Rute Register (GET)
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Proses Register dengan Validasi Konfirmasi Password
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/register?error=Konfirmasi password tidak cocok!');
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.redirect('/register?error=Username sudah digunakan!');
    }

    users.push({ username, password });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.redirect('/login?success=Registrasi berhasil, silakan login!');
});

// Rute Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;