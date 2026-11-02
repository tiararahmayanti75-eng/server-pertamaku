const express = require('express');
const router = express.Router();

// Database sementara di memori agar aman di Vercel (Serverless)
let usersInMemory = [
    { username: 'admin', password: 'admin123', role: 'admin' }
];

// Proses Register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Cek apakah username sudah terdaftar
    const existingUser = usersInMemory.find(u => u.username === username);
    if (existingUser) {
        return res.redirect('/register.html?error=Username+sudah+terdaftar');
    }

    // Tambahkan user baru ke memori
    usersInMemory.push({ username, password, role: 'user' });
    
    res.redirect('/login.html?success=Registrasi+berhasil,+silakan+login');
});

// Proses Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = usersInMemory.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = user;
        if (user.role === 'admin') {
            return res.redirect('/pesan.html');
        } else {
            return res.redirect('/pesan.html'); // Bisa dialihkan ke halaman pesan atau index
        }
    } else {
        res.redirect('/login.html?error=Username+atau+password+salah');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

module.exports = router;