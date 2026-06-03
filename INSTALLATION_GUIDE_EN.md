# Installation Guide

## Requirements
- Git 2.40 or newer.
- Node.js 20 LTS recommended.
- npm 10 or newer recommended.
- MySQL 8.0 or compatible MariaDB installation.
- 2 GB RAM for development; 4 GB or more for production-like testing.

## Windows Installation
### Install Git
Download Git from `https://git-scm.com/download/win`. Verify:
```powershell
git --version
```
A valid output looks like `git version 2.x.x.windows.x`.

### Install Node.js
Download Node.js LTS from `https://nodejs.org/`. Verify:
```powershell
node -v
npm -v
```

### Install MySQL
Install MySQL Community Server and optionally MySQL Workbench. Create the database and user:
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
```

## Ubuntu Installation
Supported versions: Ubuntu 22.04 and 24.04.
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Create database:
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

## Debian Installation
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl ca-certificates gnupg git build-essential default-mysql-server default-mysql-client
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Use the same MySQL commands as Ubuntu.

## Clone and Install
```bash
git clone <repository-url>
cd website
cd backend
npm install
cd ../frontend
npm install
```

## Environment Setup
Backend `.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=marketplace_user
DB_PASSWORD=StrongPassword123!
DB_NAME=marketplace
JWT_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_TTL_DAYS=7
ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=2097152
WHATSAPP_NUMBER=6281234567890
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=Marketplace
VITE_SITE_TAGLINE=Multi User Marketplace
VITE_CURRENCY=IDR
VITE_CURRENCY_SYMBOL=Rp
VITE_SUPPORT_EMAIL=support@example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

## Database Import
```bash
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
```

## Verification
Start backend:
```bash
cd backend
npm run dev
```
Open `http://localhost:5000/api/health`.

Start frontend:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173`.
