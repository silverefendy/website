# Multi User Marketplace Website

## Project Overview
Multi User Marketplace Website is a full-stack multi-vendor commerce platform for administrators, sellers, and customers. The system provides product discovery, seller store management, customer cart and checkout, wishlist, reviews, stock tracking, and seller analytics.

## Business Use Cases
- Launch a local or regional multi-seller marketplace.
- Provide sellers with product, stock, order, and analytics tools.
- Give customers a catalog, wishlist, cart, reviews, and order history.
- Give platform owners an administration foundation for users, categories, orders, and settings.

## Core Features
### Customer
- Registration, login, logout, and profile management.
- Product search, category filtering, price filtering, sorting, and pagination.
- Product details with images, stock status, reviews, and ratings.
- Wishlist add/remove and wishlist page.
- Cart management and checkout with stock validation.
- Order history and receipt confirmation.

### Seller
- Seller dashboard.
- Product and store management pages.
- Seller orders page.
- Analytics for total sales, monthly sales, total orders, low stock, top products, and recent orders.

### Administrator
- Admin dashboard.
- User management.
- Category management.
- Order overview.
- Site settings page.

## Technology Stack
| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Zustand, React Router v6, Axios |
| Backend | Node.js, Express.js, JWT, bcrypt, Multer, Joi, Helmet, CORS |
| Database | MySQL 8 compatible schema |
| Operations | Docker, Docker Compose, Nginx, PM2, GitHub Actions |

## Quick Start
```bash
git clone <repository-url>
cd website
cd backend && npm install
cd ../frontend && npm install
```

Create backend and frontend environment files, import `schema.sql` and `seed.sql`, then start both applications:

### Development
Backend:
```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Documentation
- English README: `README_EN.md`
- Indonesian README: `README_ID.md`
- English installation guide: `INSTALLATION_GUIDE_EN.md`
- Indonesian installation guide: `INSTALLATION_GUIDE_ID.md`
- English HTML docs: `docs/en/index.html`
- Indonesian HTML docs: `docs/id/index.html`


## Indonesian Documentation
For Indonesian readers, open `README_ID.md` and `docs/id/index.html`.
