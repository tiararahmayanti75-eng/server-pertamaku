const express = require('express');
const router = express.Router();
const Tugas = require('../models/Tugas');

// GET: Ambil tugas khusus milik user tertentu (contoh: /api/tugas?username=Tiara)
router.get('/', async (req, res) => {
    try {
        const { username } = req.query;
        const filter = username ? { username } : {};
        const dataTugas = await Tugas.find(filter);

        res.json({ 
            status: "Sukses", 
            data: dataTugas.map(t => ({ 
                id: t._id, 
                teks: t.teks || t.kegiatan, 
                prioritas: t.prioritas || 'Biasa',
                username: t.username 
            })) 
        });
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data dari MongoDB: " + error.message });
    }
});

// POST: Tambah tugas baru dengan menyertakan username pemiliknya
router.post('/', async (req, res) => {
    try {
        const { teks, kegiatan, username, prioritas } = req.body;
        const teksTugas = teks || kegiatan;
        
        if (!teksTugas || !username) {
            return res.status(400).json({ error: "Teks tugas dan username wajib diisi!" });
        }

        const tugasBaru = new Tugas({ 
            teks: teksTugas, 
            username, 
            prioritas: prioritas || 'Biasa' 
        });
        
        const simpanData = await tugasBaru.save();
        res.json({ status: "Sukses", data: simpanData });
    } catch (error) {
        res.status(500).json({ error: "Gagal menyimpan tugas ke MongoDB: " + error.message });
    }
});

// DELETE: Hapus tugas berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        await Tugas.findByIdAndDelete(req.params.id);
        res.json({ status: "Sukses", pesan: "Tugas berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus tugas dari MongoDB" });
    }
});

module.exports = router;