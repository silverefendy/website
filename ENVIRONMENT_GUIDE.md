# ENVIRONMENT_GUIDE.md

# Environment Variables Guide / Panduan Variabel Environment

## Backend Variables

| Name | Purpose | Required | Default | Example |
|---|---|---|---|---|
| NODE_ENV | Runtime environment | Recommended | development | production |
| PORT | Express API port | Yes | none | 5000 |
| DB_HOST | MySQL host | Yes | none | 127.0.0.1 |
| DB_PORT | MySQL port | Yes | none | 3306 |
| DB_USER | MySQL username | Yes | none | marketplace_user |
| DB_PASSWORD | MySQL password | Yes | none | strong_password |
| DB_NAME | MySQL database name | Yes | none | marketplace |
| JWT_SECRET | Secret for signing JWT tokens | Yes | none | long-random-secret |
| JWT_EXPIRES_IN | Legacy/general JWT expiration setting read by config | Optional | none | 1d |
| JWT_ACCESS_EXPIRES_IN | Access token lifetime | Recommended | 15m | 15m |
| JWT_REFRESH_EXPIRES_IN | Refresh token JWT lifetime | Recommended | 7d | 7d |
| JWT_REFRESH_TTL_DAYS | Refresh token database expiration days | Recommended | 7 | 7 |
| WHATSAPP_NUMBER | Support/seller WhatsApp number | Optional | none | 6281234567890 |
| UPLOAD_DIR | File upload directory | Recommended | uploads/ | uploads/ |
| MAX_FILE_SIZE | Max upload size in bytes | Optional | 2097152 | 2097152 |
| ALLOWED_ORIGINS | Comma-separated allowed frontend origins | Yes in production | empty | https://example.com |
| JSON_BODY_LIMIT | Express JSON body limit | Optional | 1mb | 1mb |
| URLENCODED_BODY_LIMIT | Express form body limit | Optional | 1mb | 1mb |
| BCRYPT_SALT_ROUNDS | Password hashing cost | Optional | 10 | 12 |

## Frontend Variables

| Name | Purpose | Required | Default | Example |
|---|---|---|---|---|
| VITE_API_URL | Backend base URL without `/api` suffix | Yes | none | http://localhost:5000 |
| VITE_SITE_NAME | Site name in UI | Recommended | none | Marketplace |
| VITE_SITE_TAGLINE | Site tagline | Optional | none | Multi User Marketplace |
| VITE_CURRENCY | Currency code | Recommended | none | IDR |
| VITE_CURRENCY_SYMBOL | Currency symbol displayed in UI | Recommended | none | Rp |
| VITE_SUPPORT_EMAIL | Support email shown in UI/docs | Optional | none | support@example.com |
| VITE_WHATSAPP_NUMBER | WhatsApp number used by frontend links | Optional | none | 6281234567890 |

## Example Backend `.env`

```env
NODE_ENV=development
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=marketplace_user
DB_PASSWORD=StrongPassword123!
DB_NAME=marketplace
JWT_SECRET=replace-with-a-very-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_TTL_DAYS=7
WHATSAPP_NUMBER=6281234567890
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=2097152
ALLOWED_ORIGINS=http://localhost:5173
JSON_BODY_LIMIT=1mb
URLENCODED_BODY_LIMIT=1mb
BCRYPT_SALT_ROUNDS=10
```

## Example Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_SITE_NAME=Marketplace
VITE_SITE_TAGLINE=Multi User Marketplace
VITE_CURRENCY=IDR
VITE_CURRENCY_SYMBOL=Rp
VITE_SUPPORT_EMAIL=support@example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

## Production Rules / Aturan Production

- Never commit `.env` files to Git.
- Use unique secrets per environment.
- Rotate `JWT_SECRET` if compromised.
- Restrict `ALLOWED_ORIGINS` to production domains only.
- Use strong database passwords.
- Store secrets in VPS environment, Docker secrets, or platform secret manager.

## Indonesian Notes / Catatan Bahasa Indonesia

- `JWT_SECRET` wajib panjang dan acak.
- `DB_PASSWORD` jangan sama dengan password user OS.
- `ALLOWED_ORIGINS` di production jangan memakai `*`.
- `VITE_API_URL` harus mengarah ke domain backend yang bisa diakses browser.
