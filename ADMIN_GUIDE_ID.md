# Panduan Administrator

## Manajemen User
Administrator mengelola akun, memeriksa user mencurigakan, memverifikasi identitas penjual, dan menonaktifkan akun jika diperlukan. Sistem production sebaiknya memiliki audit log untuk setiap perubahan status akun.

## Manajemen Role
Role saat ini adalah admin, seller, dan customer. ID role disimpan pada tabel `roles`. Untuk jangka panjang, sistem sebaiknya menggunakan permission granular, bukan hanya role ID statis.

## Pemeliharaan
Pemeliharaan rutin meliputi update dependency, pemeriksaan kesehatan database, pembersihan file upload, monitoring disk, dan review log aplikasi.

## Log dan Monitoring
Gunakan log PM2 untuk masalah runtime backend, log Nginx untuk proxy dan SSL, serta log MySQL untuk error database. Production sebaiknya memakai centralized logging dan alerting.

## Cadangan Database
Backup database MySQL dan direktori upload secara bersamaan. Simpan salinan backup di luar server utama.

## Pemulihan Data
Restore database dump menggunakan `mysql` dan arsip upload menggunakan `tar`. Uji prosedur restore di staging sebelum terjadi insiden production.
