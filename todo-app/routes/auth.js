const express = require('express');
const router = express.Router();

// Proses Register yang langsung sukses mengarah ke halaman login
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Validasi sederhana agar tidak kosong
    if (!username || !password) {
        return res.redirect('/register.html?error=Form+tidak+boleh+kosong');
    }

    // Langsung arahkan ke halaman login dengan status sukses
    res.redirect('/login.html?success=Registrasi+berhasil,+silakan+login');
});

// Proses Login yang langsung sukses masuk ke halaman pesan
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Set sesi user secara langsung agar langsung sukses masuk
    req.session.user = { 
        username: username || 'admin', 
        role: username === 'admin' ? 'admin' : 'user' 
    };

    // Langsung arahkan ke halaman pesan
    res.redirect('/pesan.html');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

module.exports = router;