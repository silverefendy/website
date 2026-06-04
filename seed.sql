SET NAMES utf8mb4;

INSERT INTO roles (id, name, description)
VALUES
  (1, 'admin', 'Administrator with full access to marketplace management.'),
  (2, 'seller', 'Seller account that can manage store profile, products, and orders.'),
  (3, 'customer', 'Customer account that can browse products, manage cart, and place orders.')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO users (id, name, email, password, phone, avatar, role_id, is_active, email_verified_at)
VALUES
  (1, 'Admin Utama', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 1, TRUE, CURRENT_TIMESTAMP),
  (2, 'Toko Contoh', 'seller@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 2, TRUE, CURRENT_TIMESTAMP),
  (3, 'Pelanggan Demo', 'customer@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 3, TRUE, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role_id = VALUES(role_id),
  is_active = VALUES(is_active),
  email_verified_at = VALUES(email_verified_at);

INSERT INTO stores (id, user_id, store_name, slug, description, logo, banner, address, city, province, postal_code, is_active)
VALUES
  (1, 2, 'Toko Contoh Official', 'toko-contoh-official', 'Toko demo untuk kebutuhan pengembangan marketplace.', NULL, NULL, NULL, 'Jakarta', 'DKI Jakarta', NULL, TRUE)
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  store_name = VALUES(store_name),
  slug = VALUES(slug),
  description = VALUES(description),
  city = VALUES(city),
  province = VALUES(province),
  is_active = VALUES(is_active);

INSERT INTO categories (id, name, slug, description, image, parent_id)
VALUES
  (1, 'Elektronik', 'elektronik', 'Produk elektronik dan gadget untuk kebutuhan harian.', NULL, NULL),
  (2, 'Fashion', 'fashion', 'Pakaian, sepatu, dan aksesori untuk berbagai gaya.', NULL, NULL),
  (3, 'Rumah & Dapur', 'rumah-dapur', 'Perlengkapan rumah tangga dan dapur.', NULL, NULL),
  (4, 'Olahraga', 'olahraga', 'Peralatan olahraga dan aktivitas luar ruang.', NULL, NULL),
  (5, 'Kecantikan', 'kecantikan', 'Produk perawatan diri dan kecantikan.', NULL, NULL),
  (6, 'Handphone & Tablet', 'handphone-tablet', 'Smartphone, tablet, dan aksesori pendukung.', NULL, 1),
  (7, 'Audio & Kamera', 'audio-kamera', 'Perangkat audio, kamera, dan perlengkapan multimedia.', NULL, 1),
  (8, 'Pakaian Pria', 'pakaian-pria', 'Atasan, bawahan, dan fashion pria.', NULL, 2),
  (9, 'Pakaian Wanita', 'pakaian-wanita', 'Atasan, bawahan, dan fashion wanita.', NULL, 2),
  (10, 'Peralatan Dapur', 'peralatan-dapur', 'Alat masak dan perlengkapan dapur.', NULL, 3),
  (11, 'Dekorasi Rumah', 'dekorasi-rumah', 'Dekorasi dan aksesori interior rumah.', NULL, 3),
  (12, 'Fitness', 'fitness', 'Peralatan olahraga kebugaran dan latihan.', NULL, 4),
  (13, 'Outdoor', 'outdoor', 'Perlengkapan aktivitas luar ruang.', NULL, 4),
  (14, 'Skincare', 'skincare', 'Produk perawatan wajah dan kulit.', NULL, 5),
  (15, 'Makeup', 'makeup', 'Produk rias wajah dan kosmetik.', NULL, 5)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  slug = VALUES(slug),
  description = VALUES(description),
  parent_id = VALUES(parent_id);

INSERT INTO products (id, store_id, category_id, name, slug, description, price, stock, weight, weight_unit, `condition`, status, views)
VALUES
  (1, 1, 6, 'Smartphone Android 128GB', 'smartphone-android-128gb', 'Smartphone Android dengan penyimpanan 128GB untuk kebutuhan komunikasi dan hiburan.', 2500000.00, 15, 350.00, 'g', 'new', 'active', 120),
  (2, 1, 7, 'Earphone Bluetooth Bass Clear', 'earphone-bluetooth-bass-clear', 'Earphone nirkabel dengan kualitas suara jernih dan baterai tahan lama.', 250000.00, 50, 120.00, 'g', 'new', 'active', 84),
  (3, 1, 8, 'Kemeja Pria Casual Oxford', 'kemeja-pria-casual-oxford', 'Kemeja pria bahan oxford nyaman untuk gaya kasual dan semi-formal.', 125000.00, 40, 300.00, 'g', 'new', 'active', 76),
  (4, 1, 9, 'Dress Wanita Midi Floral', 'dress-wanita-midi-floral', 'Dress midi motif floral dengan potongan nyaman untuk aktivitas harian.', 175000.00, 30, 280.00, 'g', 'new', 'active', 65),
  (5, 1, 10, 'Set Pisau Dapur Stainless', 'set-pisau-dapur-stainless', 'Set pisau dapur stainless steel untuk memotong bahan masakan dengan mudah.', 95000.00, 25, 700.00, 'g', 'new', 'active', 58),
  (6, 1, 11, 'Lampu Meja Dekoratif LED', 'lampu-meja-dekoratif-led', 'Lampu meja LED minimalis untuk dekorasi kamar dan ruang kerja.', 85000.00, 35, 550.00, 'g', 'new', 'active', 43),
  (7, 1, 12, 'Matras Yoga Anti Slip', 'matras-yoga-anti-slip', 'Matras yoga anti slip untuk latihan di rumah maupun studio.', 110000.00, 60, 900.00, 'g', 'new', 'active', 97),
  (8, 1, 13, 'Botol Minum Outdoor 1L', 'botol-minum-outdoor-1l', 'Botol minum kapasitas 1 liter untuk olahraga dan kegiatan outdoor.', 45000.00, 100, 250.00, 'g', 'new', 'active', 53),
  (9, 1, 14, 'Serum Wajah Niacinamide', 'serum-wajah-niacinamide', 'Serum wajah dengan kandungan niacinamide untuk perawatan kulit harian.', 75000.00, 45, 100.00, 'g', 'new', 'active', 112),
  (10, 1, 15, 'Lip Cream Matte Natural', 'lip-cream-matte-natural', 'Lip cream matte dengan warna natural dan tekstur ringan.', 25000.00, 80, 60.00, 'g', 'new', 'active', 91)
ON DUPLICATE KEY UPDATE
  store_id = VALUES(store_id),
  category_id = VALUES(category_id),
  name = VALUES(name),
  slug = VALUES(slug),
  description = VALUES(description),
  price = VALUES(price),
  stock = VALUES(stock),
  weight = VALUES(weight),
  weight_unit = VALUES(weight_unit),
  `condition` = VALUES(`condition`),
  status = VALUES(status),
  views = VALUES(views);

INSERT INTO product_images (id, product_id, image_path, is_primary, sort_order)
VALUES
  (1, 1, 'uploads/default-product.jpg', TRUE, 1),
  (2, 2, 'uploads/default-product.jpg', TRUE, 1),
  (3, 3, 'uploads/default-product.jpg', TRUE, 1),
  (4, 4, 'uploads/default-product.jpg', TRUE, 1),
  (5, 5, 'uploads/default-product.jpg', TRUE, 1),
  (6, 6, 'uploads/default-product.jpg', TRUE, 1),
  (7, 7, 'uploads/default-product.jpg', TRUE, 1),
  (8, 8, 'uploads/default-product.jpg', TRUE, 1),
  (9, 9, 'uploads/default-product.jpg', TRUE, 1),
  (10, 10, 'uploads/default-product.jpg', TRUE, 1)
ON DUPLICATE KEY UPDATE
  product_id = VALUES(product_id),
  image_path = VALUES(image_path),
  is_primary = VALUES(is_primary),
  sort_order = VALUES(sort_order);

INSERT INTO site_settings (setting_key, setting_value, description)
VALUES
  ('site_name', 'My Marketplace', 'Public site name displayed across the marketplace.'),
  ('site_tagline', 'Belanja Mudah, Harga Terbaik', 'Public tagline displayed on landing and marketing pages.'),
  ('whatsapp_number', '628xxxxxxxxxx', 'WhatsApp number used for order and customer support communication.'),
  ('currency', 'IDR', 'ISO currency code used for product prices and order totals.'),
  ('currency_symbol', 'Rp', 'Currency symbol displayed with formatted prices.'),
  ('support_email', 'support@example.com', 'Customer support email address.'),
  ('maintenance_mode', 'false', 'Controls whether the marketplace should be placed into maintenance mode.')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description);
