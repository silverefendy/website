ALTER TABLE users
  ADD COLUMN IF NOT EXISTS can_become_seller BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS seller_status ENUM('eligible','disabled') NOT NULL DEFAULT 'eligible';

ALTER TABLE products
  MODIFY COLUMN status ENUM('active','inactive','draft','archived','deleted') NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS weight_unit ENUM('g','kg','lb','pcs','ml','l') NOT NULL DEFAULT 'g',
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL,
  ADD INDEX IF NOT EXISTS idx_products_is_deleted (is_deleted);

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
