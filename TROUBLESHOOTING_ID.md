# Panduan Pemecahan Masalah

## Error Instalasi
Jika `npm install` gagal, periksa versi Node.js, hapus `node_modules`, lalu coba lagi. Gunakan `npm ci` saat package lock valid.

## Error Build
Jika muncul `vite: not found`, jalankan `npm install` di folder `frontend`. Pastikan `VITE_API_URL` sudah dikonfigurasi sebelum build.

## Error Database
Periksa status service MySQL, kredensial, nama database, grant user, dan firewall. Uji dengan `mysql -u marketplace_user -p marketplace`.

## Error Jaringan
Untuk error CORS, tambahkan origin frontend ke `ALLOWED_ORIGINS`. Untuk error proxy, periksa upstream Nginx dan port backend.

## Error SSL
Pastikan DNS benar, port 80/443 terbuka, jalankan `sudo nginx -t`, lalu ulangi Certbot. Nama domain sertifikat harus sesuai hostname.

## Error PM2
Gunakan `pm2 status`, `pm2 logs marketplace-api`, dan `pm2 restart marketplace-api`. Jalankan `pm2 save` setelah proses berjalan benar.
