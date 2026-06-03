# NGINX_GUIDE.md

# Nginx Guide / Panduan Nginx

## Purpose / Tujuan

Nginx is used as a reverse proxy and static file server.

Nginx digunakan sebagai reverse proxy dan server file statis.

## Responsibilities

- Serve frontend static files from `frontend/dist`.
- Reverse proxy `/api` requests to Express backend.
- Reverse proxy `/uploads` to backend static upload route.
- Terminate SSL/TLS in production.
- Add cache and security headers.
- Compress static responses.

## nginx.conf

`nginx.conf` is designed for Docker frontend container usage.

Important sections:
- `listen 80`: container listens on HTTP port 80.
- `root /usr/share/nginx/html`: serves Vite build files.
- `try_files $uri $uri/ /index.html`: supports React Router refresh.
- `/api/`: proxies API calls to backend container.
- `/uploads/`: proxies uploaded file requests.
- `gzip on`: compresses text responses.

## production.conf

`production.conf` is designed for VPS deployment.

Important sections:
- HTTP server redirects to HTTPS.
- HTTPS server uses Certbot certificate paths.
- `root /var/www/marketplace/frontend/dist` serves frontend.
- `/api/` proxies to `127.0.0.1:5000` where PM2 runs backend.
- `/uploads/` proxies to backend upload static server.
- Static assets are cached for 30 days.
- Basic security headers are included.

## Install Nginx

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Apply production config

```bash
sudo cp production.conf /etc/nginx/sites-available/marketplace.conf
sudo ln -s /etc/nginx/sites-available/marketplace.conf /etc/nginx/sites-enabled/marketplace.conf
sudo nginx -t
sudo systemctl reload nginx
```

## SSL

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Troubleshooting

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
sudo systemctl status nginx
```

## Indonesian Notes

- Ganti `example.com` dengan domain asli.
- Pastikan frontend sudah dibuild ke `frontend/dist`.
- Pastikan backend berjalan di port 5000.
- Pastikan firewall membuka port 80 dan 443.
