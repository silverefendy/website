-- Adds the soft-delete columns required by product queries and keeps existing
-- products visible after the migration.
ALTER TABLE products
  ADD COLUMN is_deleted TINYINT(1) DEFAULT 0;

ALTER TABLE products
  ADD COLUMN deleted_at DATETIME NULL;

UPDATE products
SET is_deleted = 0
WHERE is_deleted IS NULL;
