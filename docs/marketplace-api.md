# Marketplace API Documentation

All endpoints are prefixed with `/api`. Authenticated endpoints require a bearer access token.

## Products

### `GET /products`
Lists active products with backend pagination, search, filtering, ratings, and stock fields.

Query parameters:
- `search`: product-name, description keyword, or category-name search.
- `keyword`: additional keyword search against product name and description.
- `category`: category id or slug.
- `min_price`, `max_price`: price range filters.
- `condition`: `new` or `used`.
- `sort`: `newest`, `price_asc`/`price_low`, `price_desc`/`price_high`, `popularity`/`popular`.
- `page`: current page, defaults to `1`.
- `limit`: page size, defaults to `12`, max `50`.

Response data includes `products` and `pagination` with `total`, `totalPages`, `currentPage`, `page`, and `limit`.

### `GET /products/:slug`
Returns product details, images, reviews, `average_rating`, `review_count`, stock quantity, and `is_wishlisted` for authenticated customers.

### `POST /products/:slug/reviews`
Customer-only. Creates or updates the customer's review.

Body:
```json
{ "rating": 5, "comment": "Great product." }
```

## Categories

### `GET /categories`
Returns all categories for category search/filter controls.

## Wishlist

### `GET /wishlist`
Customer-only. Returns saved active products.

### `POST /wishlist/:productId`
Customer-only. Adds a product to the customer's wishlist.

### `DELETE /wishlist/:productId`
Customer-only. Removes a product from the customer's wishlist.

## Cart and Stock Enforcement

### `GET /cart`
Customer-only. Returns cart items with current stock.

### `POST /cart/items`
Customer-only. Adds an item after checking stock availability.

Body:
```json
{ "product_id": 1, "quantity": 2 }
```

### `PUT /cart/items/:itemId`
Customer-only. Updates quantity and rejects quantities above available stock.

### `DELETE /cart/items/:itemId`
Customer-only. Removes one cart item.

### `DELETE /cart`
Customer-only. Clears the cart.

## Orders

### `POST /orders`
Customer-only. Creates orders from selected cart items. The backend locks cart/product rows, rejects out-of-stock purchases, reduces `products.stock` after successful order creation, and removes checked-out cart items.

Body:
```json
{
  "item_ids": [10, 11],
  "shipping_address": "123 Market St",
  "shipping_city": "San Francisco",
  "shipping_province": "CA",
  "shipping_postal_code": "94103",
  "notes": "Leave at door"
}
```

### `GET /orders`
Customer-only. Returns customer orders with order items.

### `PUT /orders/:orderId/confirm-receipt`
Customer-only. Marks shipped orders as delivered.

## Seller Analytics

### `GET /seller/dashboard`
Seller-only. Returns:
- `stats.total_sales`
- `stats.total_orders`
- `stats.low_stock_products`
- `monthly_sales[]`
- `top_selling_products[]`
- `recent_orders[]`

### `GET /seller/products`
Seller-only. Returns seller products including stock for inventory management.
