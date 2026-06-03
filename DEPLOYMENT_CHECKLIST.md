# Checklist Deployment Marketplace

## 1. Persiapan Database di cPanel

- Masuk ke cPanel lalu buka menu **MySQL Databases**.
- Buat database baru untuk aplikasi marketplace.
- Buat user database baru dengan password yang kuat.
- Berikan hak akses penuh user ke database tersebut.
- Buka **phpMyAdmin**, pilih database yang baru dibuat.
- Import file `schema.sql` terlebih dahulu.
- Import file `seed.sql` setelah `schema.sql` selesai.
- Pastikan tabel `roles`, `users`, `stores`, `categories`, `products`, dan tabel lain berhasil dibuat.

## 2. Upload dan Konfigurasi Backend

- Upload folder `backend` ke hosting atau VPS yang mendukung Node.js.
- Salin `backend/.env.production.example` menjadi `backend/.env`.
- Isi konfigurasi database, `JWT_SECRET`, `WHATSAPP_NUMBER`, `UPLOAD_DIR`, dan `ALLOWED_ORIGINS` sesuai domain production.
- Jalankan `npm install` di folder `backend`.
- Jika menggunakan VPS atau hosting dengan PM2:
  - Jalankan `pm2 start ecosystem.config.js --env production`.
  - Jalankan `pm2 save` agar proses aktif kembali setelah restart server.
- Jika menggunakan fitur **Node.js App** di cPanel:
  - Pilih folder backend sebagai application root.
  - Gunakan `server.js` sebagai startup file.
  - Jalankan install dependencies dari panel.
  - Restart aplikasi setelah konfigurasi `.env` selesai.

## 3. Build Frontend dan Upload ke `public_html`

- Salin `frontend/.env.production.example` menjadi `frontend/.env.production`.
- Isi `VITE_API_URL`, `VITE_SITE_NAME`, `VITE_SITE_TAGLINE`, `VITE_CURRENCY`, `VITE_CURRENCY_SYMBOL`, `VITE_SUPPORT_EMAIL`, dan `VITE_WHATSAPP_NUMBER` sesuai production.
- Jalankan perintah berikut di folder `frontend`:

```bash
npm install
npm run build
```

- Upload seluruh isi folder `frontend/dist` ke `public_html` atau document root domain.
- Jangan upload source development yang tidak dibutuhkan ke public web root.

## 4. Konfigurasi `.htaccess`

- Pastikan file `.htaccess` dari `frontend/public/.htaccess` ikut masuk ke hasil build dan terupload ke `public_html`.
- File ini memastikan React Router tetap berjalan saat halaman seperti `/products`, `/login`, `/seller`, atau `/admin` di-refresh.
- Jika hosting memakai subfolder, sesuaikan rewrite rule dengan path subfolder tersebut.

## 5. Test Semua Fitur Utama

- Buka domain production dan pastikan halaman utama tampil.
- Test login admin, seller, dan customer.
- Test daftar akun customer baru.
- Test daftar akun seller baru dan akses Seller Dashboard.
- Test daftar produk, detail produk, filter produk, dan pencarian.
- Test tambah produk dari seller dashboard.
- Test cart: tambah item, ubah quantity, hapus item, dan checkout.
- Test pembuatan order dan pastikan redirect WhatsApp berjalan.
- Test update status order dari seller dashboard.
- Test admin panel: users, categories, orders, settings.

## 6. Checklist Keamanan Production

- Pastikan file `.env` backend tidak bisa diakses publik melalui browser.
- Pastikan folder backend tidak ditempatkan langsung di public web root tanpa proteksi.
- Gunakan `JWT_SECRET` yang panjang, acak, dan berbeda dari development.
- Hapus atau ubah akun seed production seperti `admin@example.com`, `seller@example.com`, dan `customer@example.com`.
- Ganti password semua akun seed jika seed data tetap digunakan sementara.
- Pastikan permission folder `uploads/` cukup untuk upload, tetapi tidak berlebihan.
- Aktifkan HTTPS untuk domain production.
- Batasi `ALLOWED_ORIGINS` hanya ke domain production.
- Backup database sebelum deployment besar atau migrasi lanjutan.
