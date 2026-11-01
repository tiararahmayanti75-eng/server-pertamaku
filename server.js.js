const express = require('express');
const app = express();
const PORT = 3000;

// Middleware JSON
app.use(express.json());

// Panggil file rute yang sudah dipisah
const pesanRouter = require('./routes/pesan');

// Route GET Utama
app.get('/', (req, res) => {
    res.send('Halo Tiara! Server & Rute Terpisah siap digunakan! 🎉');
});

// Gunakan rute pesan untuk semua alamat yang berawal dari /api/pesan
app.use('/api/pesan', pesanRouter);

app.listen(PORT, () => {
    console.log(`Server berjalan lancar di http://localhost:${PORT}`);
});