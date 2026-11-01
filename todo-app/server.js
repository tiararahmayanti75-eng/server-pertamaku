const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index') {
    const filePath = path.join(__dirname, 'todo-app', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('File tidak ditemukan');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } 
  else if (req.url === '/tentang') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Halaman Tentang</h1><p>Ini adalah halaman profil/tentang server lokal buatan Tiara!</p>');
  } 
  else if (req.url === '/kontak') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Halaman Kontak</h1><p>Hubungi admin server lokal di sini ya!</p>');
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1><p>Maaf, halaman tidak ditemukan!</p>');
  }
});

server.listen(3000, () => {
  console.log('Server dengan banyak rute aktif di http://localhost:3000');
});