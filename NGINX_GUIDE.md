# Nginx Guide

## Purpose
Nginx serves frontend static files, reverse-proxies API traffic, reverse-proxies uploads, terminates SSL, and adds production headers.

## Docker Config
`nginx.conf` is used by the frontend container. It serves `/usr/share/nginx/html`, supports React Router fallback, and proxies `/api` plus `/uploads` to the backend container.

## VPS Config
`production.conf` is used for VPS deployments. It redirects HTTP to HTTPS, serves `frontend/dist`, proxies backend requests to PM2 on port 5000, and configures static caching.

## Apply Config
```bash
sudo cp production.conf /etc/nginx/sites-available/marketplace.conf
sudo ln -s /etc/nginx/sites-available/marketplace.conf /etc/nginx/sites-enabled/marketplace.conf
sudo nginx -t
sudo systemctl reload nginx
```
