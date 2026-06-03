# Pertanyaan yang Sering Diajukan

## Untuk siapa aplikasi ini?
Aplikasi ini ditujukan untuk operator marketplace, penjual, pelanggan, programmer, tim IT support, dan system administrator.

## Apakah bisa dipakai production?
Bisa, tetapi production harus memakai HTTPS, secret yang kuat, backup yang sudah diuji, monitoring, audit log, dan patch dependency.

## Database apa yang dibutuhkan?
MySQL 8.0 direkomendasikan. MariaDB dapat digunakan jika kompatibel dengan constraint dan index pada skema.

## Di mana file upload disimpan?
File upload disimpan di `UPLOAD_DIR`, default `uploads/`, dan diekspos backend melalui `/uploads`.

## Praktik terbaiknya apa?
Gunakan environment terpisah, jangan commit `.env`, sinkronkan package lock, uji migrasi di staging, serta backup database dan upload secara bersamaan.
