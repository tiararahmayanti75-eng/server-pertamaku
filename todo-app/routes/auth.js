const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

// Helper baca user
const getUsers = () => {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data || '[]');
};

// Rute Login (GET) dengan dukungan pesan alert
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Rute Proses Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = username;
        res.redirect('/pesan');
    } else {
        res.redirect('/login?error=Username atau password salah!');
    }
});

// Rute Register (GET)
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Rute Proses Register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
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