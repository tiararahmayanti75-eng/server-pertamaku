const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper baca/tulis user
const userFile = path.join(__dirname, '../database-user.json');

const getUsers = () => {
    if (!fs.existsSync(userFile)) return [];
    return JSON.parse(fs.readFileSync(userFile, 'utf8'));
};

const saveUsers = (users) => {
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
};

// Proses Register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    
    // Cek apakah username sudah ada
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.redirect('/register.html?error=Username+sudah+terdaftar');
    }

    // Simpan user baru (default role: user)
    users.push({ username, password, role: 'user' });
    saveUsers(users);
    
    res.redirect('/login.html?success=Registrasi+berhasil,+silakan+login');
});

// Proses Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        if (user.role === 'admin') {
            return res.redirect('/pesan.html');
        } else {
            return res.redirect('/index.html');
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