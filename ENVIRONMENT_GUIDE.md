# Environment Variables Guide

## Backend Variables
| Name | Purpose | Required | Example |
|---|---|---|---|
| NODE_ENV | Runtime environment | Recommended | production |
| PORT | Express API port | Yes | 5000 |
| DB_HOST | MySQL host | Yes | 127.0.0.1 |
| DB_PORT | MySQL port | Yes | 3306 |
| DB_USER | MySQL username | Yes | marketplace_user |
| DB_PASSWORD | MySQL password | Yes | strong_password |
| DB_NAME | MySQL database | Yes | marketplace |
| JWT_SECRET | JWT signing secret | Yes | long-random-secret |
| JWT_ACCESS_EXPIRES_IN | Access token lifetime | Recommended | 15m |
| JWT_REFRESH_EXPIRES_IN | Refresh token lifetime | Recommended | 7d |
| JWT_REFRESH_TTL_DAYS | Refresh token storage TTL | Recommended | 7 |
| ALLOWED_ORIGINS | Allowed frontend origins | Yes | https://example.com |
| UPLOAD_DIR | Upload directory | Recommended | uploads/ |
| MAX_FILE_SIZE | Upload size in bytes | Optional | 2097152 |
| WHATSAPP_NUMBER | WhatsApp contact number | Optional | 6281234567890 |

## Frontend Variables
| Name | Purpose | Required | Example |
|---|---|---|---|
| VITE_API_URL | Backend base URL | Yes | https://api.example.com |
| VITE_SITE_NAME | Site name | Recommended | Marketplace |
| VITE_SITE_TAGLINE | Site tagline | Optional | Multi User Marketplace |
| VITE_CURRENCY | Currency code | Recommended | IDR |
| VITE_CURRENCY_SYMBOL | Currency symbol | Recommended | Rp |
| VITE_SUPPORT_EMAIL | Support email | Optional | support@example.com |
| VITE_WHATSAPP_NUMBER | WhatsApp number | Optional | 6281234567890 |

Never commit `.env` files or production secrets.
