const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '../database.json');

const getPesan = () => {
    if (!fs.existsSync(dbFile)) return [];
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data || '[]');
};

// Middleware Proteksi Halaman
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login?error=Silakan login terlebih dahulu!');
};

// Rute Halaman Daftar Pesan
router.get('/pesan', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pesan.html'));
});

// API untuk Ambil Data JSON + Mendukung Pagination & Role Info
router.get('/api/pesan', isAuthenticated, (req, res) => {
    let pesanList = getPesan();
    
    // Fitur Pagination (Default 5 data per halaman)
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = pesanList.slice(startIndex, endIndex);

    res.json({
        user: req.session.user,
        role: req.session.role,
        currentPage: page,
        totalPages: Math.ceil(pesanList.length / limit),
        data: paginatedData
    });
});

// Fitur Ekspor Data ke CSV
router.get('/pesan/export-csv', isAuthenticated, (req, res) => {
    const pesanList = getPesan();
    let csv = 'ID,Nama,Pesan\n';
    
    pesanList.forEach((p, index) => {
        csv += `${index + 1},"${p.nama}","${p.pesan}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('data-pesan.csv');
    res.send(csv);
});

// Rute Tambah Pesan (POST)
router.post('/kontak', (req, res) => {
    const { nama, pesan } = req.body;
    const pesanList = getPesan();
    pesanList.push({ id: Date.now(), nama, pesan });
    fs.writeFileSync(dbFile, JSON.stringify(pesanList, null, 2));
    res.redirect('/kontak?success=Pesan berhasil dikirim!');
});

// Rute Hapus Pesan (Hanya Admin yang Bisa Menghapus)
router.get('/pesan/hapus/:id', isAuthenticated, (req, res) => {
    if (req.session.role !== 'admin') {
        return res.send("<script>alert('Akses ditolak! Hanya admin yang dapat menghapus pesan.'); window.location='/pesan';</script>");
    }

    const id = parseInt(req.params.id);
    let pesanList = getPesan();
    pesanList = pesanList.filter(p => p.id !== id);
    fs.writeFileSync(dbFile, JSON.stringify(pesanList, null, 2));
    res.redirect('/pesan');
});

module.exports = router;