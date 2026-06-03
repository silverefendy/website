# API Documentation

## Authentication
Protected endpoints require `Authorization: Bearer <access_token>`. Access tokens are refreshed through `/api/auth/refresh` using a refresh token.

## Endpoint Groups
- `GET /api/health` checks API health.
- `/api/auth` handles register, login, refresh, logout, profile, and password change.
- `/api/products` handles listing, detail, and reviews.
- `/api/categories` lists categories.
- `/api/wishlist` manages customer saved products.
- `/api/cart` manages customer cart items.
- `/api/orders` creates and lists customer orders.
- `/api/seller` returns seller analytics and products.

## Request Example
```http
GET /api/products?search=phone&page=1&limit=12 HTTP/1.1
Host: localhost:5000
Content-Type: application/json
```

## Response Example
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

## Error Handling
Errors use a consistent shape with `success: false`, message, and optional errors. Common statuses are 401 for unauthorized, 403 for forbidden, 404 for missing resources, 409 for stock conflicts, and 422 for validation errors.
