# SECURITY_GUIDE.md

# Security Guide / Panduan Keamanan

## JWT Security

Current implementation:
- Access tokens are JWTs.
- Refresh tokens are JWTs with `jti`.
- Refresh tokens are hashed with SHA-256 in database.
- Refresh tokens rotate on refresh.
- Logout revokes refresh tokens.

Recommendations:
- Use strong `JWT_SECRET` with at least 32 random bytes.
- Keep access token lifetime short (15 minutes).
- Prefer HTTP-only secure cookies for refresh tokens in production.
- Add CSRF protection when relying on cookies.
- Rotate secrets after incidents.

## Password Hashing

Current implementation uses bcrypt.

Recommendations:
- Use `BCRYPT_SALT_ROUNDS=10-12` depending on server performance.
- Add password reset flow.
- Add email verification.
- Add breached-password checks for production.

## Upload Security

Current implementation:
- Multer disk storage.
- MIME allowlist for images.
- File size limit.

Risks:
- MIME type can be spoofed.
- Uploaded files are publicly served.

Recommendations:
- Validate file extension and magic bytes.
- Re-encode images before storage.
- Store outside web root or in object storage.
- Scan files with antivirus.
- Generate random filenames.
- Add upload cleanup jobs.

## API Security

Current protections:
- Helmet.
- CORS allowlist.
- Auth rate limiter.
- Request body limits.
- Sanitization middleware.
- Parameterized SQL.

Recommendations:
- Add rate limits to all sensitive endpoints.
- Add Joi validators for every route.
- Add audit logs for admin/seller actions.
- Add request IDs and structured logs.
- Add security headers at Nginx too.

## SQL Injection

Current implementation mostly uses `db.execute` parameter binding. Continue this pattern.

Do not build SQL using raw user input. Sort fields must always come from allowlists.

## XSS

Current mitigation:
- Request sanitization strips dangerous strings.
- React escapes output by default.

Recommendations:
- Avoid `dangerouslySetInnerHTML`.
- Sanitize rich text if introduced.
- Use strict Content Security Policy.

## CSRF

Risk exists when browsers send cookies automatically.

Recommendations:
- Use SameSite cookies.
- Add CSRF tokens for state-changing cookie-auth endpoints.
- Keep CORS allowlist strict.

## Rate Limiting

Current auth rate limiter is in place for auth routes.

Recommendations:
- Use Redis-backed rate limit store in multi-instance deployments.
- Add rate limits to reviews, wishlist, cart, checkout, and uploads.

## Production Hardening Checklist

- [ ] HTTPS enforced.
- [ ] Strong secrets configured.
- [ ] Seed users removed or password changed.
- [ ] `.env` not committed.
- [ ] Database user has least privilege.
- [ ] Uploads scanned and backed up.
- [ ] Nginx security headers configured.
- [ ] Dependencies audited.
- [ ] Logs monitored.
- [ ] Backups tested.

## Indonesian Summary

Keamanan production wajib memperhatikan JWT secret, validasi input, upload file, rate limiting, HTTPS, backup, logging, dan audit trail. Jangan memakai akun seed di production tanpa mengganti password.
