# TROUBLESHOOTING.md

# Troubleshooting Guide / Panduan Pemecahan Masalah

## Port already in use / EADDRINUSE

### Error
```text
EADDRINUSE: address already in use :::5000
```

### Cause
Another process is using the same port.

### Fix Linux/macOS
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Fix Windows
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change `PORT` in backend `.env`.

---

## MySQL connection failed

### Symptoms
- Backend cannot start.
- API returns database errors.

### Checks
```bash
sudo systemctl status mysql
mysql -u marketplace_user -p marketplace
```

### Fixes
- Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Ensure database exists.
- Ensure user has grants.
- Check firewall if database is remote.

---

## npm install failed

### Causes
- Network problem.
- Node.js version incompatible.
- Corrupted `node_modules`.
- Package lock mismatch.

### Fix
```bash
rm -rf node_modules package-lock.json
npm install
```

For production prefer:
```bash
npm ci
```

If using Windows, delete `node_modules` manually if `rm` is unavailable.

---

## vite build failed

### Error
```text
vite: not found
```

### Fix
```bash
cd frontend
npm install
npm run build
```

### Other build errors
- Check `VITE_API_URL` exists.
- Check imports are installed in `package.json`.
- Check package lock is synchronized.

---

## JWT invalid

### Symptoms
- User redirected to login.
- API returns `Unauthorized`.

### Causes
- Token expired.
- `JWT_SECRET` changed.
- Wrong token type.
- Refresh token revoked.

### Fix
- Login again.
- Confirm backend `JWT_SECRET` is stable.
- Clear browser storage.
- Check `refresh_tokens` table.

---

## File upload failed

### Causes
- Unsupported MIME type.
- File too large.
- Upload directory permission denied.
- Disk full.

### Fix
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
df -h
```

Check `MAX_FILE_SIZE` and allowed image types.

---

## Permission denied

### Linux fixes
```bash
sudo chown -R $USER:$USER /var/www/marketplace
chmod -R u+rwX /var/www/marketplace
```

Do not use `chmod 777` in production except as a temporary diagnostic step.

---

## Nginx errors

### Test config
```bash
sudo nginx -t
```

### Reload
```bash
sudo systemctl reload nginx
```

### Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Common fixes
- Correct `root` path for frontend dist.
- Correct backend proxy port.
- Ensure PM2 backend is running.
- Ensure DNS points to VPS.

---

## SSL errors

### Certbot test
```bash
sudo certbot renew --dry-run
```

### Common fixes
- DNS A record must point to server.
- Port 80/443 must be open.
- Nginx config must be valid.
- Domain must match certificate.

---

## PM2 errors

### Check status
```bash
pm2 status
pm2 logs marketplace-api
```

### Restart
```bash
pm2 restart marketplace-api
```

### Recreate process
```bash
pm2 delete marketplace-api
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## CORS blocked

### Browser error
```text
Access to XMLHttpRequest has been blocked by CORS policy
```

### Fix
Add frontend origin to backend `.env`:
```env
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

Restart backend.

---

## Product image not loading

### Causes
- `VITE_API_URL` wrong.
- Upload path missing.
- Nginx `/uploads` proxy misconfigured.

### Fix
- Open image URL directly in browser.
- Check backend static `/uploads` route.
- Check Nginx upload location.

---

## Indonesian Quick Checklist

- Cek `.env`.
- Cek service MySQL.
- Cek `pm2 logs`.
- Cek `nginx -t`.
- Cek firewall.
- Cek permission folder uploads.
- Cek package sudah `npm install`.
