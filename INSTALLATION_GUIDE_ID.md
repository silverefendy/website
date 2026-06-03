# Panduan Instalasi

## Kebutuhan Sistem
- Git 2.40 atau lebih baru.
- Node.js 20 LTS direkomendasikan.
- npm 10 atau lebih baru direkomendasikan.
- MySQL 8.0 atau MariaDB yang kompatibel.
- RAM 2 GB untuk development; 4 GB atau lebih untuk pengujian mendekati production.

## Instalasi Windows
### Instal Git
Unduh Git dari `https://git-scm.com/download/win`. Verifikasi:
```powershell
git --version
```
Output yang benar berbentuk `git version 2.x.x.windows.x`.

### Instal Node.js
Unduh Node.js LTS dari `https://nodejs.org/`. Verifikasi:
```powershell
node -v
npm -v
```

### Instal MySQL
Instal MySQL Community Server dan opsional MySQL Workbench. Buat database dan user:
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
```

## Instalasi Ubuntu
Versi yang didukung: Ubuntu 22.04 dan 24.04.
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Buat database:
```bash
sudo mysql
```
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Instalasi Debian
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl ca-certificates gnupg git build-essential default-mysql-server default-mysql-client
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Gunakan perintah MySQL yang sama seperti Ubuntu.

## Clone dan Instal Dependency
```bash
git clone <repository-url>
cd website
cd backend
npm install
cd ../frontend
npm install
```

## Konfigurasi Environment
File `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=marketplace_user
DB_PASSWORD=StrongPassword123!
DB_NAME=marketplace
JWT_SECRET=ganti-dengan-secret-panjang-dan-acak
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_TTL_DAYS=7
ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=2097152
WHATSAPP_NUMBER=6281234567890
```

File `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=Marketplace
VITE_SITE_TAGLINE=Multi User Marketplace
VITE_CURRENCY=IDR
VITE_CURRENCY_SYMBOL=Rp
VITE_SUPPORT_EMAIL=support@example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

## Import Database
```bash
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
```

## Verifikasi
Jalankan backend:
```bash
cd backend
npm run dev
```
Buka `http://localhost:5000/api/health`.

Jalankan frontend:
```bash
cd frontend
npm run dev
```
Buka `http://localhost:5173`.
