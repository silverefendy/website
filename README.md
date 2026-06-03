# Multi User Marketplace Website

> English / Indonesian documentation.  
> Dokumentasi Bahasa Inggris / Bahasa Indonesia.

## Project Overview / Gambaran Proyek

### English
Multi User Marketplace Website is a web application that connects sellers and customers in one marketplace platform. Sellers can manage stores and products, customers can browse products, manage carts, save wishlist items, submit reviews, and place orders, while administrators manage platform data such as users, categories, orders, and settings.

### Indonesian
Multi User Marketplace Website adalah aplikasi web yang menghubungkan penjual dan pelanggan dalam satu platform marketplace. Penjual dapat mengelola toko dan produk, pelanggan dapat melihat produk, mengelola keranjang, menyimpan wishlist, memberikan ulasan, dan membuat pesanan, sedangkan administrator mengelola data platform seperti user, kategori, order, dan pengaturan.

## Purpose / Tujuan

- Provide a starter production marketplace architecture.
- Support multiple roles: admin, seller, customer.
- Provide secure JWT authentication and MySQL-backed data storage.
- Provide a maintainable React frontend and Express backend.

## Business Use Cases / Kegunaan Bisnis

- Local marketplace for small businesses.
- Multi-vendor online shop.
- Catalog and order-management system.
- Seller dashboard for sales monitoring.
- Customer product discovery, wishlist, reviews, and orders.

## Features / Fitur

### Authentication and Account
- Register as seller or customer.
- Login/logout.
- Access token + refresh token authentication.
- Refresh token rotation and revocation.
- Profile management with avatar upload.
- Password change.

### Marketplace
- Product list.
- Product detail.
- Search by product name, keyword, and category.
- Category filter.
- Price range filter.
- Sorting by newest, price ascending, price descending, and popularity.
- Backend/frontend pagination.
- Product images.
- Product reviews, average rating, and review count.
- Wishlist add/remove and customer wishlist page.
- Stock display, low-stock warnings, and out-of-stock prevention.

### Customer
- Cart management.
- Checkout from selected cart items.
- Order history.
- Receipt confirmation.
- WhatsApp support links.

### Seller
- Seller dashboard.
- Product management pages.
- Store profile page.
- Seller orders page.
- Analytics: total sales, monthly sales, total orders, top-selling products, low-stock count, and recent orders.

### Admin
- Admin dashboard.
- User management page.
- Category management page.
- All orders page.
- Site settings page.

### Security and Operations
- Helmet HTTP headers.
- CORS allowlist.
- Rate limiting for auth endpoints.
- Request sanitization.
- Joi validation schemas.
- Multer upload restrictions.
- MySQL foreign keys, indexes, and constraints.
- Docker, Nginx, PM2, CI/CD, and deployment documentation.

## Technology Stack / Teknologi

| Area | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Zustand, React Router v6, Axios, TailwindCSS dashboard chart UI |
| Backend | Node.js, Express.js, JWT, bcrypt, Multer, Joi, Helmet, CORS |
| Database | MySQL / MariaDB-compatible MySQL engine |
| Deployment | PM2, Nginx, Docker, Docker Compose, VPS, Railway, Render, Vercel, Coolify |
| Documentation | Markdown, Bootstrap 5 HTML docs, Mermaid diagrams |

## System Requirements / Kebutuhan Sistem

### Minimum
- Node.js 18 LTS
- npm 9+
- MySQL 8.0 or MariaDB 10.6+
- 1 CPU core
- 1 GB RAM
- 10 GB disk

### Recommended
- Node.js 20 LTS
- npm 10+
- MySQL 8.0+
- 2 CPU cores
- 2-4 GB RAM
- 30 GB SSD
- Nginx reverse proxy

### Production
- Node.js 20 LTS or 22 LTS
- MySQL 8.0 managed or dedicated server
- 2+ CPU cores
- 4+ GB RAM
- 50+ GB SSD
- PM2 process manager
- Nginx with SSL/TLS
- Automated backups
- Monitoring and log rotation

## Installation / Instalasi Singkat

### 1. Clone repository
```bash
git clone <repository-url>
cd website
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Create MySQL database
```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Import schema and seed
```bash
mysql -u marketplace_user -p marketplace < schema.sql
mysql -u marketplace_user -p marketplace < seed.sql
```

## Configuration / Konfigurasi

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=marketplace_user
DB_PASSWORD=strong_password
DB_NAME=marketplace
JWT_SECRET=replace-with-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_TTL_DAYS=7
ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=2097152
WHATSAPP_NUMBER=6281234567890
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=Marketplace
VITE_SITE_TAGLINE=Multi User Marketplace
VITE_CURRENCY=IDR
VITE_CURRENCY_SYMBOL=Rp
VITE_SUPPORT_EMAIL=support@example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

See `ENVIRONMENT_GUIDE.md` for detailed explanations.

## Running / Menjalankan Aplikasi

### Development
Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Open:
```text
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api/health
```

### Production
Build frontend:
```bash
cd frontend
npm run build
```

Run backend:
```bash
cd backend
npm start
```

Recommended production process manager:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
```

## Deployment / Deployment Dasar

1. Provision VPS with Ubuntu 22.04/24.04.
2. Install Node.js, MySQL, Nginx, PM2, Certbot.
3. Clone repository.
4. Configure backend and frontend environment files.
5. Import database schema and seed.
6. Build frontend.
7. Run backend with PM2.
8. Configure Nginx reverse proxy.
9. Enable SSL with Certbot.
10. Configure backups and monitoring.

Detailed deployment steps are in `DEPLOYMENT_GUIDE.md`.

## Troubleshooting / Pemecahan Masalah

| Problem | Quick Fix |
|---|---|
| `EADDRINUSE` | Change `PORT` or stop process using the port. |
| MySQL connection failed | Check DB credentials, service status, firewall, and grants. |
| `vite: not found` | Run `npm install` inside `frontend`. |
| JWT invalid | Verify `JWT_SECRET` and token expiration. |
| Upload failed | Check `UPLOAD_DIR`, permissions, MIME type, file size. |
| CORS blocked | Add frontend origin to `ALLOWED_ORIGINS`. |

See `TROUBLESHOOTING.md` for full details.

## FAQ

### What is this system for?
A multi-role marketplace for product browsing, seller management, customer orders, and platform administration.

### Can I use it in production?
Yes as a foundation, but complete the security, testing, observability, backup, and deployment recommendations first.

### Which database is required?
MySQL 8.0 is recommended.

### Where are uploaded files stored?
By default in `backend/uploads` or the configured `UPLOAD_DIR`, exposed as `/uploads`.

### What are demo accounts?
`seed.sql` includes demo admin, seller, and customer accounts. Change or remove them in production.

## Related Documentation

- `SYSTEM_ANALYSIS.md`
- `INSTALLATION_GUIDE.md`
- `USER_GUIDE.md`
- `ADMIN_GUIDE.md`
- `API_DOCUMENTATION.md`
- `DATABASE_GUIDE.md`
- `ENVIRONMENT_GUIDE.md`
- `DEPLOYMENT_GUIDE.md`
- `DOCKER_GUIDE.md`
- `PM2_GUIDE.md`
- `SECURITY_GUIDE.md`
- `BACKUP_GUIDE.md`
- `TROUBLESHOOTING.md`
- `docs/index.html`
