const mongoose = require('mongoose');

const tugasSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Field baru untuk pemilik tugas
    teks: { type: String, required: true },
    prioritas: { type: String, default: 'Biasa' }, // Fitur prioritas tugas
    selesai: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tugas', tugasSchema);