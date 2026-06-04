SET NAMES utf8mb4;

ALTER TABLE orders
  ADD INDEX idx_orders_store_status_created (store_id, status, created_at),
  ADD INDEX idx_orders_user_created (user_id, created_at);

ALTER TABLE notifications
  ADD INDEX idx_notifications_user_read_created (user_id, is_read, created_at);

ALTER TABLE product_images
  ADD INDEX idx_product_images_product_primary_sort (product_id, is_primary, sort_order, id);
