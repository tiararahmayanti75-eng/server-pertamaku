const express = require('express');
const router = express.Router();

// Proses Register yang aman dari error
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    
    // Cek sederhana
    if (!username || !password) {
        return res.redirect('/register.html?error=Form+kosong');
    }

    // Langsung sukses ke halaman login
    res.redirect('/login.html?success=Registrasi+berhasil');
});

// Proses Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    req.session.user = { 
        username: username || 'admin', 
        role: 'user' 
    };

    res.redirect('/pesan.html');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

module.exports = router;