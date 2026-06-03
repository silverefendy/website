# Dokumentasi API

## Autentikasi
Endpoint yang dilindungi membutuhkan header `Authorization: Bearer <access_token>`. Access token diperbarui melalui `/api/auth/refresh` menggunakan refresh token.

## Grup Endpoint
- `GET /api/health` untuk memeriksa kesehatan API.
- `/api/auth` untuk registrasi, login, refresh, logout, profil, dan ganti password.
- `/api/products` untuk daftar produk, detail produk, dan ulasan.
- `/api/categories` untuk daftar kategori.
- `/api/wishlist` untuk produk simpanan pelanggan.
- `/api/cart` untuk item keranjang pelanggan.
- `/api/orders` untuk membuat dan melihat order pelanggan.
- `/api/seller` untuk analitik dan produk penjual.

## Contoh Request
```http
GET /api/products?search=phone&page=1&limit=12 HTTP/1.1
Host: localhost:5000
Content-Type: application/json
```

## Contoh Response
```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": {
    "products": [],
    "pagination": { "total": 0, "totalPages": 1, "currentPage": 1, "page": 1, "limit": 12 }
  }
}
```

## Penanganan Error
Error memakai format konsisten dengan `success: false`, message, dan optional errors. Status umum adalah 401 untuk belum login, 403 untuk akses ditolak, 404 untuk data tidak ditemukan, 409 untuk konflik stok, dan 422 untuk validasi gagal.
