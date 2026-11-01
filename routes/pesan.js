const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../database.json');
const pesanHtmlPath = path.join(__dirname, '../public/pesan.html');
const editHtmlPath = path.join(__dirname, '../public/edit-pesan.html');
const profilHtmlPath = path.join(__dirname, '../public/profil.html');

// Middleware Cek Login
const cekLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.send(`<h1>Akses Ditolak! ⛔</h1><p>Kamu harus login terlebih dahulu.</p><a href="/login">Menuju Halaman Login</a>`);
};

// 1. Rute Tampilkan Daftar Pesan dengan Tombol Edit & Hapus
router.get('/pesan', cekLogin, (req, res) => {
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    let listPesan = [];
    if (!err && fileData) {
      try { listPesan = JSON.parse(fileData); } catch (e) { listPesan = []; }
    }

    fs.readFile(pesanHtmlPath, 'utf8', (err, htmlTemplate) => {
      if (err) return res.status(500).send('Gagal memuat halaman pesan.');

      let rowsHtml = '';
      listPesan.forEach((item, index) => {
        rowsHtml += `
          <tr>
              <td>${item.nama}</td>
              <td>${item.pesan}</td>
              <td>${item.waktu}</td>
              <td>
                  <a href="/edit-pesan/${index}" style="background: #ffc107; color: black; padding: 5px 10px; text-decoration: none; border-radius: 4px; margin-right: 5px;">Edit</a>
                  <a href="/hapus-pesan/${index}" class="btn-hapus" onclick="return confirm('Yakin ingin menghapus pesan ini?')">Hapus</a>
              </td>
          </tr>
        `;
      });

      let tabelLengkap = `
        <table>
            <tr>
                <th>Nama Pengirim</th>
                <th>Pesan</th>
                <th>Waktu</th>
                <th>Aksi</th>
            </tr>
            ${rowsHtml}
        </table>
      `;

      let finalHtml = htmlTemplate
        .replace('<b id="user-display">User</b>', `<b>${req.session.user}</b>`)
        .replace('<div id="tabel-container">\n        <!-- Tabel akan dimuat secara dinamis dari server -->\n    </div>', tabelLengkap);

      res.send(finalHtml);
    });
  });
});

// 2. Rute Halaman Edit Pesan (GET)
router.get('/edit-pesan/:id', cekLogin, (req, res) => {
  const id = req.params.id;
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) return res.status(500).send('Gagal membaca database.');
    let listPesan = [];
    try { listPesan = JSON.parse(fileData); } catch (e) { listPesan = []; }

    const pesanTarget = listPesan[id];
    if (!pesanTarget) return res.send('Pesan tidak ditemukan!');

    fs.readFile(editHtmlPath, 'utf8', (err, htmlTemplate) => {
      if (err) return res.status(500).send('Gagal memuat halaman edit.');

      // Masukkan data lama ke form
      let finalHtml = htmlTemplate
        .replace('id="input-nama" required', `id="input-nama" value="${pesanTarget.nama}" required`)
        .replace('id="input-pesan" rows="4" required></textarea>', `id="input-pesan" rows="4" required>${pesanTarget.pesan}</textarea>`);

      res.send(finalHtml);
    });
  });
});

// 3. Rute Proses Simpan Edit Pesan (POST)
router.post('/edit-pesan/:id', cekLogin, (req, res) => {
  const id = req.params.id;
  const { nama, pesan } = req.body;

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) return res.status(500).send('Gagal membaca database.');
    let listPesan = [];
    try { listPesan = JSON.parse(fileData); } catch (e) { listPesan = []; }

    if (listPesan[id]) {
      listPesan[id].nama = nama;
      listPesan[id].pesan = pesan;
      listPesan[id].waktu = new Date().toLocaleString() + ' (Diperbarui)';

      fs.writeFile(filePath, JSON.stringify(listPesan, null, 2), (err) => {
        if (err) return res.status(500).send('Gagal menyimpan perubahan.');
        res.redirect('/pesan');
      });
    } else {
      res.send('Pesan tidak ditemukan.');
    }
  });
});

// 4. Rute Halaman Profil (GET)
router.get('/profil', cekLogin, (req, res) => {
  res.sendFile(profilHtmlPath);
});

// 5. API kecil untuk memberikan data user aktif ke frontend profil
router.get('/api/current-user', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// 6. Rute Proses Hapus Pesan
router.get('/hapus-pesan/:id', cekLogin, (req, res) => {
  const idPesannya = req.params.id;

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) return res.status(500).send('Gagal membaca database.');
    
    let listPesan = [];
    try { listPesan = JSON.parse(fileData); } catch (e) { listPesan = []; }

    listPesan.splice(idPesannya, 1);

    fs.writeFile(filePath, JSON.stringify(listPesan, null, 2), (err) => {
      if (err) return res.status(500).send('Gagal menghapus data.');
      res.redirect('/pesan');
    });
  });
});

// 7. Rute POST untuk Menyimpan Pesan dari Form Kontak
router.post('/kirim-pesan', (req, res) => {
  const dataBaru = {
    nama: req.body.nama,
    pesan: req.body.pesan,
    waktu: new Date().toLocaleString()
  };

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    let listPesan = [];
    if (!err && fileData) {
      try { listPesan = JSON.parse(fileData); } catch (e) { listPesan = []; }
    }
    listPesan.push(dataBaru);
    fs.writeFile(filePath, JSON.stringify(listPesan, null, 2), (err) => {
      if (err) return res.status(500).send('Gagal menyimpan.');
      res.send(`<h1>Terima kasih, ${req.body.nama}!</h1><p>Pesan tersimpan.</p><a href="/pesan">Lihat Daftar Pesan</a> | <a href="/kontak">Kembali</a>`);
    });
  });
});

module.exports = router;