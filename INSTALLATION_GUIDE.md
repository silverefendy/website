# INSTALLATION_GUIDE.md

# Complete Installation Guide / Panduan Instalasi Lengkap

This guide is written for beginners and IT staff.  
Panduan ini ditulis untuk pemula dan staf IT.

---

# WINDOWS INSTALLATION

## 1. Install Git

### What is Git?
Git is a version control system. It tracks code changes and allows developers to clone, update, branch, and collaborate on the repository.

### Apa itu Git?
Git adalah sistem version control. Git melacak perubahan kode dan memungkinkan developer melakukan clone, update, branch, dan kolaborasi pada repository.

### Why Git is needed / Mengapa Git dibutuhkan
- Download the repository from Git hosting.
- Pull future updates.
- Commit local changes.
- Work safely with branches.

### Download location
Download Git for Windows from:
```text
https://git-scm.com/download/win
```

### Verify installation
Open PowerShell or Command Prompt:
```powershell
git --version
```

Expected output:
```text
git version 2.x.x.windows.x
```

If you see a version number, Git is installed correctly.  
Jika muncul nomor versi, Git sudah terinstal dengan benar.

---

## 2. Install Node.js

### What is Node.js?
Node.js is a JavaScript runtime used to run the backend API and frontend build tools.

### Apa itu Node.js?
Node.js adalah runtime JavaScript untuk menjalankan backend API dan build tool frontend.

### Why it is needed / Mengapa dibutuhkan
- Backend Express runs on Node.js.
- Frontend Vite uses Node.js tooling.
- npm installs project dependencies.

### Recommended version
Use Node.js **20 LTS** or newer LTS.

Download:
```text
https://nodejs.org/
```

### Verify
```powershell
node -v
npm -v
```

Expected output:
```text
v20.x.x
10.x.x
```

`node -v` shows Node.js version. `npm -v` shows npm package manager version.

---

## 3. Install MySQL

### MySQL Community Edition
MySQL Community Edition is the free database server used by this application.

Download:
```text
https://dev.mysql.com/downloads/mysql/
```

### MySQL Workbench
MySQL Workbench is a graphical tool to manage MySQL databases.

Download:
```text
https://dev.mysql.com/downloads/workbench/
```

### Create database
Open MySQL Workbench or MySQL Shell:
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Create user
```sql
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
```

### Grant permissions
```sql
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
```

Explanation:
- `CREATE DATABASE` creates the application database.
- `CREATE USER` creates a dedicated database login.
- `GRANT ALL PRIVILEGES` gives the app access only to its own database.
- `FLUSH PRIVILEGES` reloads permission tables.

---

## 4. Clone repository

```powershell
git clone <repository-url>
cd website
```

Explanation:
- `git clone` downloads the repository.
- `cd website` enters the project folder.

---

## 5. Install dependencies

Backend:
```powershell
cd backend
npm install
```

Frontend:
```powershell
cd ..\frontend
npm install
```

Explanation:
- `npm install` reads `package.json` and installs required libraries into `node_modules`.

---

## 6. Configure `.env`

Create `backend\.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=marketplace_user
DB_PASSWORD=StrongPassword123!
DB_NAME=marketplace
JWT_SECRET=change-this-to-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_TTL_DAYS=7
ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=2097152
WHATSAPP_NUMBER=6281234567890
```

Create `frontend\.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=Marketplace
VITE_SITE_TAGLINE=Multi User Marketplace
VITE_CURRENCY=IDR
VITE_CURRENCY_SYMBOL=Rp
VITE_SUPPORT_EMAIL=support@example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

Every variable is explained in `ENVIRONMENT_GUIDE.md`.

---

## 7. Import database schema

From repository root:
```powershell
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
```

Explanation:
- First command creates tables.
- Second command inserts roles, demo users, demo categories/products, and settings.

---

## 8. Run backend

```powershell
cd backend
npm run dev
```

Expected output:
```text
API server is running on port 5000
```

Verify:
```text
http://localhost:5000/api/health
```

---

## 9. Run frontend

Open a second terminal:
```powershell
cd frontend
npm run dev
```

Expected output:
```text
Local: http://localhost:5173/
```

---

## 10. Open browser

Open:
```text
http://localhost:5173
```

Verify:
- Home page loads.
- Product page loads.
- Register/login works.
- API health endpoint returns success.

---

# UBUNTU INSTALLATION

Supported: Ubuntu 22.04 and Ubuntu 24.04.

## 1. Update system
```bash
sudo apt update
sudo apt upgrade -y
```

Explanation:
- `apt update` refreshes package metadata.
- `apt upgrade -y` installs available updates.

## 2. Install Git
```bash
sudo apt install -y git
git --version
```

## 3. Install Node.js and npm
Recommended using NodeSource for Node.js 20 LTS:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 4. Install MySQL
```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation
```

## 5. Create database and user
```bash
sudo mysql
```

Inside MySQL:
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 6. Clone repository
```bash
git clone <repository-url>
cd website
```

## 7. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

## 8. Configure environment
```bash
nano backend/.env
nano frontend/.env
```

Use the variables shown in the Windows section.

## 9. Import database
```bash
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
```

## 10. Run development servers
Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

Open browser:
```text
http://localhost:5173
```

---

# DEBIAN INSTALLATION

Supported: Debian 11 and Debian 12.

## 1. Update system
```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Install required tools
```bash
sudo apt install -y curl ca-certificates gnupg git build-essential
```

## 3. Install Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 4. Install MySQL or MariaDB
Debian often ships MariaDB by default:
```bash
sudo apt install -y default-mysql-server default-mysql-client
sudo systemctl enable mariadb || sudo systemctl enable mysql
sudo systemctl start mariadb || sudo systemctl start mysql
```

Secure installation:
```bash
sudo mysql_secure_installation
```

## 5. Create database and user
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

## 6. Clone, install, configure, and run
```bash
git clone <repository-url>
cd website
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cp backend/.env.example backend/.env 2>/dev/null || nano backend/.env
cp frontend/.env.example frontend/.env 2>/dev/null || nano frontend/.env
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
cd backend && npm run dev
```

Open another terminal:
```bash
cd website/frontend
npm run dev
```

---

# Installation Verification Checklist

- `git --version` works.
- `node -v` returns Node.js 18/20/22.
- `npm -v` returns npm version.
- MySQL service is running.
- `schema.sql` imports without error.
- Backend prints API server port.
- Frontend prints Vite local URL.
- Browser can open frontend.
- `/api/health` returns `success: true`.
