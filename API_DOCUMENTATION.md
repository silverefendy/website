# API_DOCUMENTATION.md

# API Documentation / Dokumentasi API

Base URL:
```text
http://localhost:5000/api
```

Production base URL depends on deployment domain.  
Base URL production tergantung domain deployment.

## Common Headers

### Public request
```http
Content-Type: application/json
```

### Authenticated request
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

## Common Response Format

Success:
```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

---

# OpenAPI-Style Summary

```yaml
openapi: 3.0.3
info:
  title: Multi User Marketplace API
  version: 1.0.0
servers:
  - url: http://localhost:5000/api
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

---

# Health

## GET /health

Authentication Required: No

### Response
```json
{
  "success": true,
  "message": "API server is healthy.",
  "data": { "status": "ok" }
}
```

### Error Responses
- `500` Internal server error.

---

# Authentication

## POST /auth/register

Authentication Required: No

### Request Body
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer",
  "store_name": "Optional for seller",
  "description": "Optional seller store description"
}
```

### Response
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "jwt",
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "user": { "id": 1, "name": "Customer Name", "email": "customer@example.com", "role_id": 3 }
  }
}
```

### Error Responses
- `400` Invalid selected role.
- `409` Email already registered.
- `422` Validation failed.
- `429` Too many auth requests.

## POST /auth/login

Authentication Required: No

### Request Body
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

### Response
Returns token pair and user object.

### Error Responses
- `401` Invalid email or password.
- `422` Validation failed.
- `429` Too many auth requests.

## POST /auth/refresh

Authentication Required: Refresh token body/cookie.

### Request Body
```json
{
  "refresh_token": "refresh-token"
}
```

### Response
```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "data": {
    "token": "new-access-token",
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### Error Responses
- `401` Invalid refresh token.
- `422` Validation failed.

## POST /auth/logout

Authentication Required: Optional access token; refresh token is required in body.

### Request Body
```json
{
  "refresh_token": "refresh-token"
}
```

### Response
```json
{ "success": true, "message": "Logout successful.", "data": null }
```

## GET /auth/me

Authentication Required: Yes

### Response
Returns current authenticated user.

### Error Responses
- `401` Unauthorized.

## PUT /auth/profile

Authentication Required: Yes

Content-Type: `multipart/form-data` if uploading avatar.

### Request Body
Fields:
- `name`
- `phone`
- `avatar` file, optional

### Response
Returns updated user.

### Error Responses
- `401` Unauthorized.
- `422` Validation failed.

## PUT /auth/change-password

Authentication Required: Yes

### Request Body
```json
{
  "current_password": "oldPassword123",
  "password": "newPassword123",
  "password_confirmation": "newPassword123"
}
```

### Response
```json
{ "success": true, "message": "Password changed successfully.", "data": null }
```

---

# Products

## GET /products

Authentication Required: No

### Query Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| search | string | No | Product name, description, or category name search |
| keyword | string | No | Product name/description keyword |
| category | string/int | No | Category slug or ID |
| min_price | number | No | Minimum price |
| max_price | number | No | Maximum price |
| condition | string | No | `new` or `used` |
| sort | string | No | `newest`, `price_asc`, `price_low`, `price_desc`, `price_high`, `popularity`, `popular` |
| page | integer | No | Page number, default 1 |
| limit | integer | No | Page size, default 12, max 50 |

### Example
```http
GET /api/products?search=phone&category=electronics&min_price=100000&page=1&limit=12
```

### Response
```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product",
        "slug": "product",
        "price": "100000.00",
        "stock": 10,
        "average_rating": "4.5",
        "review_count": 2,
        "primary_image": "uploads/image.jpg"
      }
    ],
    "pagination": {
      "total": 100,
      "totalPages": 9,
      "currentPage": 1,
      "page": 1,
      "limit": 12
    }
  }
}
```

## GET /products/{slug}

Authentication Required: Optional. Authenticated customers also receive `is_wishlisted`.

### Path Parameters
- `slug`: product slug.

### Response
Returns product detail, images, reviews, rating summary, stock, and seller data.

### Error Responses
- `404` Product not found.

## POST /products/{slug}/reviews

Authentication Required: Yes, customer role.

### Request Body
```json
{
  "rating": 5,
  "comment": "Excellent product."
}
```

### Response
```json
{ "success": true, "message": "Review submitted successfully.", "data": null }
```

### Error Responses
- `401` Unauthorized.
- `403` Forbidden.
- `404` Product not found.
- `422` Rating must be between 1 and 5.

---

# Categories

## GET /categories

Authentication Required: No

### Response
```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": { "categories": [] }
}
```

---

# Wishlist

## GET /wishlist

Authentication Required: Yes, customer role.

### Response
```json
{
  "success": true,
  "message": "Wishlist retrieved successfully.",
  "data": { "items": [], "products": [] }
}
```

## POST /wishlist/{productId}

Authentication Required: Yes, customer role.

### Path Parameters
- `productId`: active product ID.

### Response
```json
{ "success": true, "message": "Product added to wishlist.", "data": null }
```

### Error Responses
- `404` Product not found.

## DELETE /wishlist/{productId}

Authentication Required: Yes, customer role.

### Response
```json
{ "success": true, "message": "Product removed from wishlist.", "data": null }
```

---

# Cart

## GET /cart

Authentication Required: Yes, customer role.

### Response
```json
{
  "success": true,
  "message": "Cart retrieved successfully.",
  "data": { "items": [] }
}
```

## POST /cart/items

Authentication Required: Yes, customer role.

### Request Body
```json
{
  "product_id": 1,
  "quantity": 2
}
```

### Error Responses
- `404` Product not found.
- `409` Not enough stock available.
- `422` Quantity must be positive.

## PUT /cart/items/{itemId}

Authentication Required: Yes, customer role.

### Request Body
```json
{ "quantity": 3 }
```

### Error Responses
- `404` Cart item not found.
- `409` Not enough stock available.
- `422` Quantity must be positive.

## DELETE /cart/items/{itemId}

Authentication Required: Yes, customer role.

### Response
Returns updated cart items.

## DELETE /cart

Authentication Required: Yes, customer role.

### Response
Returns empty cart.

---

# Orders

## GET /orders

Authentication Required: Yes, customer role.

### Response
```json
{
  "success": true,
  "message": "Orders retrieved successfully.",
  "data": { "orders": [] }
}
```

## POST /orders

Authentication Required: Yes, customer role.

### Request Body
```json
{
  "item_ids": [1, 2],
  "shipping_address": "123 Street",
  "shipping_city": "Jakarta",
  "shipping_province": "DKI Jakarta",
  "shipping_postal_code": "10110",
  "notes": "Optional note"
}
```

### Response
Creates one order per store represented in selected cart items and reduces stock.

### Error Responses
- `409` Some cart items unavailable or out of stock.
- `422` Missing selected items or invalid shipping data.

## PUT /orders/{orderId}/confirm-receipt

Authentication Required: Yes, customer role.

### Response
```json
{ "success": true, "message": "Receipt confirmed successfully.", "data": null }
```

---

# Seller

## GET /seller/dashboard

Authentication Required: Yes, seller/admin role.

### Response
```json
{
  "success": true,
  "message": "Seller analytics retrieved successfully.",
  "data": {
    "stats": {
      "total_products": 10,
      "low_stock_products": 2,
      "total_orders": 20,
      "pending_orders": 3,
      "total_sales": "500000.00"
    },
    "monthly_sales": [],
    "top_selling_products": [],
    "recent_orders": []
  }
}
```

## GET /seller/products

Authentication Required: Yes, seller/admin role.

### Response
Returns seller products including stock.

---

# Error Reference / Referensi Error

| HTTP | Meaning | Indonesian |
|---:|---|---|
| 400 | Bad request | Request salah |
| 401 | Unauthorized | Belum login / token salah |
| 403 | Forbidden | Role tidak memiliki akses |
| 404 | Not found | Data tidak ditemukan |
| 409 | Conflict | Konflik data, misalnya stok kurang |
| 422 | Validation failed | Validasi gagal |
| 429 | Too many requests | Terlalu banyak request |
| 500 | Internal server error | Kesalahan server |
