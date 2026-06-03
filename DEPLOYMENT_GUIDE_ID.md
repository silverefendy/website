# Panduan Deployment

## Penerapan di VPS
Gunakan Ubuntu 22.04 atau 24.04. Instal Node.js, MySQL, Nginx, PM2, UFW, dan Certbot. Letakkan aplikasi di `/var/www/marketplace`, atur file environment, import database, build frontend, dan jalankan backend memakai PM2.

## Deployment Docker
Gunakan `docker-compose.yml` untuk menjalankan container MySQL, backend, dan frontend. Secret production jangan disimpan langsung di compose file. Gunakan volume persisten untuk database dan upload.

## Nginx
Nginx menyajikan frontend dan meneruskan request `/api` serta `/uploads` ke backend. React Router membutuhkan konfigurasi `try_files $uri $uri/ /index.html`.

## SSL
Gunakan Certbot:
```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## PM2
Jalankan backend production:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

## Konfigurasi Domain
Buat DNS A record untuk domain utama dan www yang mengarah ke IP VPS. Tunggu propagasi DNS sebelum membuat sertifikat SSL.

## Strategi Backup
Jadwalkan dump MySQL harian dan arsip direktori upload. Simpan salinan di luar server dan uji proses restore setiap bulan.
