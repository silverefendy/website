# DEPLOYMENT_GUIDE.md

# Deployment Guide / Panduan Deployment

## LOCALHOST

Localhost deployment is for development and testing.

Steps:
1. Install Git, Node.js, npm, and MySQL.
2. Clone repository.
3. Install backend/frontend dependencies.
4. Create `.env` files.
5. Import `schema.sql` and `seed.sql`.
6. Run backend and frontend dev servers.

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

---

## UBUNTU VPS

Supported: Ubuntu 22.04 and 24.04.

### 1. Install packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server ufw certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Firewall / UFW
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 3. MySQL
```bash
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation
sudo mysql
```

```sql
CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Deploy code
```bash
sudo mkdir -p /var/www/marketplace
sudo chown -R $USER:$USER /var/www/marketplace
git clone <repository-url> /var/www/marketplace
cd /var/www/marketplace
```

### 5. Backend
```bash
cd backend
npm ci --omit=dev || npm install --omit=dev
nano .env
node scripts/migrate.js ../schema.sql
```

### 6. Frontend
```bash
cd ../frontend
npm ci || npm install
nano .env.production
npm run build
```

### 7. PM2 startup
```bash
cd /var/www/marketplace
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

Run the command printed by `pm2 startup`.

### 8. Nginx reverse proxy
Copy `production.conf`:
```bash
sudo cp production.conf /etc/nginx/sites-available/marketplace.conf
sudo ln -s /etc/nginx/sites-available/marketplace.conf /etc/nginx/sites-enabled/marketplace.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 9. SSL with Certbot
```bash
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

### 10. Domain setup
Create DNS records:
```text
A     example.com       <VPS-IP>
A     www.example.com   <VPS-IP>
```

### 11. PM2 monitoring
```bash
pm2 status
pm2 logs marketplace-api
pm2 monit
```

### 12. Log management
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

---

## NIAGAHOSTER VPS

### Minimum specification
- 1 vCPU
- 1 GB RAM
- 20 GB SSD

### Recommended specification
- 2 vCPU
- 4 GB RAM
- 50 GB SSD

### Deployment
Niagahoster VPS usually provides Ubuntu templates. Follow the Ubuntu VPS steps:
1. Point domain DNS to VPS IP.
2. Install Node.js, MySQL, Nginx, PM2, Certbot.
3. Clone project to `/var/www/marketplace`.
4. Configure `.env`.
5. Build frontend.
6. Start backend with PM2.
7. Configure Nginx and SSL.

---

## NETCITI VPS

1. Provision Ubuntu/Debian server.
2. Confirm SSH access.
3. Follow Ubuntu VPS or Debian installation steps.
4. Configure firewall and provider security group if available.
5. Use Nginx + Certbot for HTTPS.
6. Monitor disk usage for uploads.

---

## CONTABO VPS

Contabo VPS often has generous disk capacity. Recommended:
- Use Ubuntu 24.04.
- Enable UFW.
- Keep backups off-server because local disk backups do not protect against VPS loss.
- Follow Ubuntu VPS steps.

---

## HETZNER VPS

Hetzner Cloud deployment recommendations:
- Use Ubuntu 24.04 image.
- Enable Hetzner firewall for ports 22, 80, 443.
- Use cloud snapshots plus MySQL dumps.
- Follow Ubuntu VPS steps.

---

## RAILWAY

Railway can host backend and MySQL separately.

Backend:
1. Create Railway project.
2. Add Node service from GitHub repository.
3. Set root directory to `backend`.
4. Set environment variables.
5. Add MySQL plugin or external MySQL.
6. Set start command: `npm start`.

Frontend:
- Deploy separately to Vercel/Netlify or Railway static build.
- Set `VITE_API_URL` to Railway backend URL.

---

## RENDER

Backend:
1. Create Web Service.
2. Connect GitHub repository.
3. Root directory: `backend`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add environment variables.

Frontend:
1. Create Static Site.
2. Root directory: `frontend`.
3. Build command: `npm install && npm run build`.
4. Publish directory: `dist`.

---

## VERCEL

Frontend deployment:
1. Import repository.
2. Set root directory to `frontend`.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Set `VITE_API_URL` to backend URL.

Backend deployment separately:
- Use Railway, Render, VPS, or Docker host.
- Do not deploy MySQL on Vercel serverless functions for this architecture.

---

## COOLIFY

Coolify deployment:
1. Connect Git repository.
2. Create Docker Compose resource using `docker-compose.yml`.
3. Configure environment variables in Coolify UI.
4. Attach persistent volumes for MySQL and uploads.
5. Configure domain and SSL in Coolify.
6. Deploy.

---

## Production Checklist

- HTTPS enabled.
- Strong JWT secret.
- Seed users changed/removed.
- MySQL backup enabled.
- Upload backup enabled.
- PM2 process saved.
- Nginx config tested.
- Firewall enabled.
- Logs monitored.
- Dependency vulnerabilities reviewed.
