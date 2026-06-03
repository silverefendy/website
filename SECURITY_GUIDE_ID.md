# Panduan Keamanan

## Autentikasi
Sistem menggunakan JWT access token dan refresh token. Hash refresh token disimpan di MySQL dan diganti saat proses refresh.

## Otorisasi
Middleware role mengatur akses admin, seller, dan customer. Protected route di frontend mencegah akses tidak sengaja ke halaman khusus role.

## JWT
Gunakan `JWT_SECRET` panjang dan acak, masa berlaku access token yang pendek, dan penanganan refresh token yang aman. Rotasi secret jika ada indikasi kebocoran.

## Keamanan Password
Password di-hash dengan bcrypt. Production sebaiknya menerapkan aturan password kuat, verifikasi email, dan fitur reset password.

## Keamanan Upload
Upload dibatasi berdasarkan MIME type dan ukuran. Production sebaiknya memvalidasi magic bytes, melakukan re-encode gambar, memindai malware, dan menyimpan file di object storage.

## Risiko OWASP
Risiko utama meliputi broken access control, injection, XSS, CSRF, upload file berbahaya, dan logging yang kurang. Gunakan validasi, parameterized SQL, CORS ketat, HTTPS, audit log, dan dependency scanning.
