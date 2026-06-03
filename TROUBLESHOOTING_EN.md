# Troubleshooting Guide

## Installation Errors
If `npm install` fails, verify Node.js version, delete `node_modules`, and retry. Use `npm ci` when package lock is valid.

## Build Errors
If `vite: not found`, run `npm install` inside `frontend`. Confirm `VITE_API_URL` is configured before building.

## Database Errors
Check MySQL service status, credentials, database name, grants, and firewall. Test with `mysql -u marketplace_user -p marketplace`.

## Network Errors
For CORS errors, add the frontend origin to `ALLOWED_ORIGINS`. For proxy errors, check Nginx upstream configuration and backend port.

## SSL Errors
Verify DNS records, open ports 80/443, run `sudo nginx -t`, and retry Certbot. Certificate domain names must match the requested hostnames.

## PM2 Errors
Use `pm2 status`, `pm2 logs marketplace-api`, and `pm2 restart marketplace-api`. Run `pm2 save` after successful process changes.
