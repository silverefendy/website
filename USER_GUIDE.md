# USER_GUIDE.md

# User Guide / Panduan Pengguna

This guide explains how normal users use the marketplace.  
Panduan ini menjelaskan cara pengguna memakai marketplace.

## 1. Roles / Peran

| Role | English | Indonesian |
|---|---|---|
| Customer | Browse products, manage cart, wishlist, orders, reviews | Melihat produk, keranjang, wishlist, order, ulasan |
| Seller | Manage store, products, orders, analytics | Mengelola toko, produk, order, analytics |
| Admin | Manage platform users, categories, orders, settings | Mengelola user, kategori, order, pengaturan |

## 2. Registration / Registrasi

### Steps
1. Open the website.
2. Click **Register**.
3. Fill name, email, password, and role.
4. If registering as seller, enter store name and description.
5. Submit the form.
6. The system logs you in if registration succeeds.

### Screenshot Placeholder
```text
[SCREENSHOT: Registration page]
```

### Tips
- Use a valid email address.
- Use a strong password.
- Seller store slug is generated automatically.

## 3. Login / Masuk

### Steps
1. Click **Login**.
2. Enter email and password.
3. Submit.
4. You are redirected based on role or can navigate normally.

```text
[SCREENSHOT: Login page]
```

## 4. Logout / Keluar

### Steps
1. Click user avatar/name in the navigation bar.
2. Click **Logout**.
3. Session is cleared and refresh token is revoked.

## 5. Profile / Profil

Customers can open **My Profile** to update personal data and avatar.

```text
[SCREENSHOT: Profile page]
```

## 6. Marketplace Browsing / Menjelajah Marketplace

### Product List
Open **Products** to view product cards.

Features:
- Search by product name or keyword.
- Filter by category.
- Filter by minimum and maximum price.
- Filter by condition.
- Sort by newest, low price, high price, or popularity.
- Use pagination controls.

```text
[SCREENSHOT: Product list filters and pagination]
```

### Product Detail
Click a product card to open detail.

Detail page shows:
- Product images.
- Name and price.
- Rating and review count.
- Views.
- Stock quantity.
- Low-stock/out-of-stock warning.
- Seller name.
- Add to cart.
- Add/remove wishlist.
- Contact store by WhatsApp.
- Description and reviews tab.

```text
[SCREENSHOT: Product detail page]
```

## 7. Wishlist / Wishlist

### Add product to wishlist
1. Open product detail.
2. Click **Add to Wishlist**.
3. Button changes to **Wishlisted**.

### Remove product from wishlist
1. Open product detail.
2. Click **Wishlisted**.
3. Item is removed.

### View wishlist
1. Open user menu.
2. Click **Wishlist**.

```text
[SCREENSHOT: Wishlist page]
```

## 8. Reviews / Ulasan Produk

### Submit review
1. Login as customer.
2. Open product detail.
3. Open **Reviews** tab.
4. Select 1-5 stars.
5. Enter comment.
6. Submit.

The system stores one review per user per product and updates an existing review if submitted again.

```text
[SCREENSHOT: Product review form]
```

## 9. Cart / Keranjang

### Add item
1. Open product detail.
2. Enter quantity.
3. Click **Add to Cart**.

The system prevents adding items when stock is insufficient.

### Update quantity
1. Open **Cart**.
2. Change quantity.
3. The backend validates stock.

### Remove item
1. Open **Cart**.
2. Click **Remove**.

```text
[SCREENSHOT: Cart page]
```

## 10. Checkout and Orders / Checkout dan Order

### Checkout
1. Open cart.
2. Select cart items.
3. Fill shipping address, city, province, postal code, and notes.
4. Click **Checkout**.
5. The backend creates order(s) and reduces stock.

### Order history
1. Click user menu.
2. Open **My Orders**.
3. Expand an order to view items and shipping address.

### Confirm receipt
If order status is **shipped**, click **Confirm Receipt** to mark it delivered.

```text
[SCREENSHOT: My Orders page]
```

## 11. Uploads / Upload File

### Avatar upload
Use the profile page to upload an avatar image.

Allowed image types:
- JPEG
- PNG
- WebP
- GIF

Maximum file size depends on backend `MAX_FILE_SIZE` configuration.

## 12. Seller Quick Guide / Panduan Cepat Seller

1. Login as seller.
2. Open **Seller Dashboard**.
3. View sales cards and monthly sales chart.
4. Open **My Products** to review stock and product status.
5. Open **Store Profile** to manage store details.
6. Open **Seller Orders** to manage customer orders.

```text
[SCREENSHOT: Seller dashboard]
```

## 13. Admin Quick Guide / Panduan Cepat Admin

1. Login as admin.
2. Open **Admin Dashboard**.
3. Manage users, categories, orders, and settings from the admin sidebar.

```text
[SCREENSHOT: Admin dashboard]
```

## 14. Common User Problems / Masalah Umum

| Problem | Solution |
|---|---|
| Cannot login | Check email/password and account status. |
| Cart fails | Product may be out of stock. |
| Upload fails | Check file type and size. |
| Page redirects to login | Session expired; login again. |
| Wishlist unavailable | Login as customer. |
