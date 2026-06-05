-- Schema synchronization for databases that already have the 20260603 marketplace
-- and 20260604 category migrations but are missing the feature refactor and
-- performance index migrations.
--
-- This file intentionally uses one ALTER operation per statement. The migration
-- runner skips duplicate column/index errors, which makes this migration safe for
-- both older partially-migrated databases and fresh databases created from
-- schema.sql.

ALTER TABLE users
  ADD COLUMN can_become_seller BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE users
  ADD COLUMN seller_status ENUM('eligible','disabled') NOT NULL DEFAULT 'eligible';

ALTER TABLE products
  MODIFY COLUMN status ENUM('active','inactive','draft','archived','deleted') NOT NULL DEFAULT 'draft';

ALTER TABLE products
  ADD COLUMN weight_unit ENUM('g','kg','lb','pcs','ml','l') NOT NULL DEFAULT 'g';

ALTER TABLE products
  ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE products
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE products
  ADD INDEX idx_products_is_deleted (is_deleted);

UPDATE products
SET is_deleted = 0
WHERE is_deleted IS NULL;

CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NULL,
  movement_type ENUM('IN','OUT','ADJUSTMENT') NOT NULL,
  quantity INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stock_movements_product_id (product_id),
  INDEX idx_stock_movements_user_id (user_id),
  INDEX idx_stock_movements_type (movement_type),
  CONSTRAINT fk_stock_movements_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_stock_movements_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_stock_movements_quantity_non_negative CHECK (quantity >= 0),
  CONSTRAINT chk_stock_movements_previous_stock_non_negative CHECK (previous_stock >= 0),
  CONSTRAINT chk_stock_movements_new_stock_non_negative CHECK (new_stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE orders
  ADD INDEX idx_orders_store_status_created (store_id, status, created_at);

ALTER TABLE orders
  ADD INDEX idx_orders_user_created (user_id, created_at);

ALTER TABLE notifications
  ADD INDEX idx_notifications_user_read_created (user_id, is_read, created_at);

ALTER TABLE product_images
  ADD INDEX idx_product_images_product_primary_sort (product_id, is_primary, sort_order, id);
