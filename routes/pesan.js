const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pesanFile = path.join(__dirname, '../database-tugas.json');

const getPesan = () => {
    if (!fs.existsSync(pesanFile)) return [];
    return JSON.parse(fs.readFileSync(pesanFile, 'utf8'));
};

const savePesan = (data) => {
    fs.writeFileSync(pesanFile, JSON.stringify(data, null, 2));
};

// API Ambil Semua Pesan (untuk ditampilkan di frontend)
router.get('/api/pesan', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = getPesan();
    res.json({ user: req.session.user, data });
});

// API Tambah Pesan Baru
router.post('/api/pesan', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { pesan } = req.body;
    const data = getPesan();
    
    const newMessage = {
        id: Date.now(),
        nama: req.session.user.username,
        pesan: pesan
    };

    data.unshift.newMessage; // Masukkan ke urutan paling atas
    savePesan(data);
    res.redirect('/pesan.html');
});

// API Hapus Pesan (Khusus Admin atau Pemilik Pesan)
router.get('/api/pesan/hapus/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    const id = Number(req.params.id);
    let data = getPesan();
    
    // Filter data (hapus yang ID-nya cocok)
    data = data.filter(item => item.id !== id);
    savePesan(data);
    
    res.redirect('/pesan.html');
});

module.exports = router;