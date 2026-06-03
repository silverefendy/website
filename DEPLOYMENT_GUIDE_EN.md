# Deployment Guide

## VPS Deployment
Use Ubuntu 22.04 or 24.04. Install Node.js, MySQL, Nginx, PM2, UFW, and Certbot. Place the application under `/var/www/marketplace`, configure environment files, import the database, build the frontend, and run the backend with PM2.

## Docker Deployment
Use `docker-compose.yml` to run MySQL, backend, and frontend containers. Keep production secrets outside the compose file and mount persistent volumes for database and uploads.

## Nginx
Nginx serves the frontend and reverse-proxies `/api` and `/uploads` to the backend. React Router requires `try_files $uri $uri/ /index.html`.

## SSL
Use Certbot:
```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## PM2
Start production backend:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

## Domain Setup
Create DNS A records for root and www domains pointing to the VPS IP. Wait for DNS propagation before issuing SSL certificates.

## Backup Strategy
Schedule daily MySQL dumps and upload archive backups. Store copies outside the server and test restore procedures monthly.
