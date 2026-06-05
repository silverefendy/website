# Database Migrations and Schema Sync

This repository treats Git as the source of truth for database structure. Local and
production databases must be updated by running SQL migration files committed in
`backend/migrations`; do not apply ad-hoc schema changes directly to MySQL.

## Current Migration Order

Run migrations in filename order unless a deployment runbook explicitly says
otherwise:

1. `backend/migrations/20260603_marketplace_features.sql`
   - Creates `wishlists`.
   - Adds `idx_products_created_at`.
2. `backend/migrations/20260604_category_image_column.sql`
   - Adds `categories.image`.
3. `backend/migrations/20260604_feature_refactor.sql`
   - Adds seller eligibility fields on `users`.
   - Adds product `weight_unit`, `is_deleted`, and `deleted_at`.
   - Creates `stock_movements`.
   - Adds `idx_products_is_deleted`.
4. `backend/migrations/20260604_performance_indexes.sql`
   - Adds performance indexes for orders, notifications, and product images.
5. `backend/migrations/20260604_products_soft_delete_columns.sql`
   - Adds product soft-delete columns only. This is a partial hotfix migration and
     does not replace the full feature-refactor migration.
6. `backend/migrations/20260605_schema_sync.sql`
   - Synchronizes databases that already have the 20260603 marketplace migration
     and category image migration, but are missing the 20260604 feature refactor,
     soft-delete columns, stock movement table, and performance indexes.

## How to Run a Migration

From the backend directory, run one migration file at a time:

```bash
cd backend
npm run migrate -- ./migrations/20260605_schema_sync.sql
```

The current migration runner executes the file passed on the command line. It does
not automatically discover pending files.

## Setup a New Database

For a new database, use the committed schema and seed data:

```bash
mysql -u <user> -p -e "CREATE DATABASE IF NOT EXISTS fndstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u <user> -p fndstore < schema.sql
mysql -u <user> -p fndstore < seed.sql
```

Then install and start the applications:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Sync an Existing `fndstore` Database

The audited `fndstore` database already has:

- `20260603_marketplace_features.sql`
- `20260604_category_image_column.sql`

It is missing:

- `20260604_feature_refactor.sql`
- `20260604_performance_indexes.sql`
- `20260604_products_soft_delete_columns.sql`

Run the schema sync migration:

```bash
cd backend
npm run migrate -- ./migrations/20260605_schema_sync.sql
```

This migration adds the missing columns, table, and indexes needed by the current
backend source code.

## Rollback Guidance

The project does not currently include down migrations. For production rollback:

1. Take a database backup before running any migration.
2. Roll back application code first if the deployment fails before schema writes.
3. If schema writes completed and a rollback is required, restore from backup or
   apply a manually reviewed rollback script prepared for that incident.
4. Do not drop columns such as `is_deleted`, `deleted_at`, `weight_unit`,
   `can_become_seller`, or `seller_status` while code still references them.

## Migration System Review

The current migration system has no migration history table and no automatic
pending-migration discovery. The runner executes only the file supplied in the
command line.

Recommended future implementation:

```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  checksum CHAR(64) NOT NULL,
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Recommended runner behavior:

1. Read `backend/migrations/*.sql` in sorted filename order.
2. Calculate a SHA-256 checksum for each file.
3. Skip files already present in `schema_migrations` with the same checksum.
4. Stop and fail if an applied filename has a different checksum.
5. Run each unapplied migration in a transaction when supported by MySQL for the
   contained statements.
6. Insert the migration filename and checksum after successful execution.

## Soft Delete Decision

Use **Option A: full soft delete**.

Rationale:

- Orders, reviews, wishlists, and stock movement history can continue to reference
  the original product record.
- Sellers and administrators keep an audit trail through `deleted_at`.
- The current source already models product deletion as `is_deleted` plus
  `deleted_at`, with `status = 'deleted'` as a display/status marker.

Consistency rules:

- Public product listing and product detail must filter `p.status = 'active'` and
  `p.is_deleted = 0`.
- Wishlist, cart, checkout, seller dashboards, and admin product counts must ignore
  deleted products.
- Product delete operations must set `is_deleted = 1`, set `deleted_at`, and set
  `status = 'deleted'`.
- Hard delete should only be used for dependent rows that are safe to recreate,
  such as uploaded product image rows during product image replacement.

## Audit Notes

Schema dependencies found in source code:

- `products.weight_unit` is used by seller product create/edit flows and seed data.
- `products.is_deleted` and `products.deleted_at` are used by product listing,
  detail, wishlist, cart, checkout, seller dashboard, and delete flows.
- `users.can_become_seller` and `users.seller_status` are used by admin user
  management and authentication logic.
- `stock_movements` is used by product stock adjustment and order checkout.
- `wishlists` is used by wishlist endpoints and product detail wishlisted state.

Technical debt to address later:

- Add `schema_migrations` tracking so production can reliably identify applied and
  pending migrations.
- Add down migrations or documented rollback scripts for every production change.
- Optimize order list endpoints that load order items in a loop for each order.
- Add automated integration tests that run migrations against an empty MySQL
  database and verify `/api/categories`, `/api/products`, cart, wishlist, orders,
  seller, and admin endpoints.
