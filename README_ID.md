# Multi User Marketplace Website

## Gambaran Proyek
Multi User Marketplace Website adalah platform marketplace multi-penjual berbasis web untuk administrator, penjual, dan pelanggan. Sistem ini menyediakan pencarian produk, pengelolaan toko penjual, keranjang dan checkout pelanggan, wishlist, ulasan produk, stok barang, dan analitik penjualan.

## Kegunaan Bisnis
- Membangun marketplace lokal atau regional dengan banyak penjual.
- Memberikan fitur pengelolaan produk, stok, order, dan analitik kepada penjual.
- Memberikan katalog, wishlist, keranjang, ulasan, dan riwayat order kepada pelanggan.
- Memberikan fondasi administrasi untuk user, kategori, order, dan pengaturan website.

## Fitur Utama
### Pelanggan
- Registrasi, login, logout, dan pengelolaan profil.
- Pencarian produk, filter kategori, filter harga, pengurutan, dan pagination.
- Detail produk dengan gambar, status stok, ulasan, dan rating.
- Tambah/hapus wishlist dan halaman wishlist.
- Keranjang belanja dan checkout dengan validasi stok.
- Riwayat order dan konfirmasi penerimaan barang.

### Penjual
- Dashboard penjual.
- Halaman pengelolaan produk dan profil toko.
- Halaman order penjual.
- Analitik total penjualan, penjualan bulanan, total order, stok menipis, produk terlaris, dan order terbaru.

### Administrator
- Dashboard admin.
- Manajemen user.
- Manajemen kategori.
- Ringkasan order.
- Pengaturan website.

## Teknologi
| Lapisan | Teknologi |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Zustand, React Router v6, Axios |
| Backend | Node.js, Express.js, JWT, bcrypt, Multer, Joi, Helmet, CORS |
| Database | Skema kompatibel MySQL 8 |
| Operasional | Docker, Docker Compose, Nginx, PM2, GitHub Actions |

## Mulai Cepat
```bash
git clone <repository-url>
cd website
cd backend && npm install
cd ../frontend && npm install
```

Buat file environment backend dan frontend, import `schema.sql` dan `seed.sql`, lalu jalankan aplikasi:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Dokumentasi
- README Bahasa Inggris: `README_EN.md`
- README Bahasa Indonesia: `README_ID.md`
- Panduan instalasi Bahasa Inggris: `INSTALLATION_GUIDE_EN.md`
- Panduan instalasi Bahasa Indonesia: `INSTALLATION_GUIDE_ID.md`
- Dokumentasi HTML Bahasa Inggris: `docs/en/index.html`
- Dokumentasi HTML Bahasa Indonesia: `docs/id/index.html`
