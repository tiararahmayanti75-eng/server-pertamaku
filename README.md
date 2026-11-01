# 🚀 Aplikasi Web Full-Stack Express.js Modular

Aplikasi web modern berbasis Node.js dan Express.js dengan arsitektur modular, sistem autentikasi aman, manajemen database JSON lokal, serta antarmuka elegan menggunakan Tailwind CSS.

## ✨ Fitur Utama
- **Arsitektur Modular**: Pemisahan rute (`routes/auth.js`, `routes/pesan.js`) dan folder statis (`public/`) yang bersih dan terstandarisasi.
- **Autentikasi & Sesi**: Sistem Login & Register aman menggunakan `express-session` dengan middleware proteksi halaman rahasia.
- **CRUD Penuh (Create, Read, Update, Delete)**: 
  - Kirim pesan baru melalui form kontak.
  - Tampilkan daftar pesan masuk dalam tabel interaktif.
  - Edit dan perbarui pesan yang sudah ada.
  - Hapus pesan dengan konfirmasi langsung.
- **Antarmuka Modern**: Desain UI responsif dan cantik menggunakan Tailwind CSS CDN.
- **Cloud-Ready**: Dioptimalkan untuk deployment ke platform cloud (seperti Render.com).

## 🛠️ Teknologi yang Digunakan
- **Backend**: Node.js, Express.js, Express-Session, File System (`fs`).
- **Frontend**: HTML5, Tailwind CSS.
- **Database**: Local JSON Storage (`database.json`, `users.json`).

## ⚙️ Cara Instalasi & Menjalankan Lokal
1. Clone repository ini atau unduh kodenya.
2. Install dependencies:
   ```bash
   npm install