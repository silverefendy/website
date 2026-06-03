# ADMIN_GUIDE.md

# Administrator Guide / Panduan Administrator

## 1. System Administration / Administrasi Sistem

Administrators manage platform-level data and operational health.

Main responsibilities:
- Manage users.
- Manage categories.
- Monitor orders.
- Update site settings.
- Coordinate backups and restores.
- Review security and deployment logs.

## 2. Admin Access / Akses Admin

Admin role uses `role_id = 1`. Admin routes are protected by frontend `ProtectedRoute` and backend role middleware where applicable.

Seed demo admin:
```text
Email: admin@example.com
Password: password
```

Change or remove seed credentials in production.

## 3. User Management / Manajemen User

Admin user management page is available at:
```text
/admin/users
```

Recommended operations:
- View users.
- Activate/deactivate suspicious accounts.
- Verify seller identity before allowing production selling.
- Reset passwords through a secure future password-reset workflow.

Security recommendation:
- Add audit logging for user status changes.
- Add pagination and search for large user lists.

## 4. Role Management / Manajemen Role

Current roles:
| ID | Role | Description |
|---:|---|---|
| 1 | admin | Platform administrator |
| 2 | seller | Store/product/order manager |
| 3 | customer | Buyer/customer |

Roles are seeded in `seed.sql` and stored in the `roles` table.

Future recommendation:
- Add granular permissions table.
- Add admin UI for permission assignment.
- Avoid hard-coded role IDs in long-term enterprise deployments.

## 5. Category Management / Manajemen Kategori

Admin category page:
```text
/admin/categories
```

Categories support:
- Name.
- Slug.
- Description.
- Image.
- Parent category.

Operational tips:
- Use stable slugs for SEO.
- Avoid deleting categories with active products; prefer disabling or reassigning products.

## 6. Order Administration / Administrasi Order

Admin all-orders page:
```text
/admin/orders
```

Use cases:
- Monitor pending orders.
- Resolve customer/seller disputes.
- Confirm order lifecycle problems.
- Export reports in future enhancements.

## 7. Uploads Management / Manajemen Upload

Uploads are stored in `UPLOAD_DIR` and served as `/uploads`.

Admin tasks:
- Monitor disk usage.
- Remove orphaned files.
- Validate suspicious uploads.
- Back up uploads with database backups.

Recommended production approach:
- Move uploads to S3-compatible object storage.
- Use image processing and malware scanning.

## 8. Database Management / Manajemen Database

### Schema
Main schema file:
```text
schema.sql
```

### Seed data
Initial data file:
```text
seed.sql
```

### Migration runner
```bash
cd backend
npm run migrate -- ../backend/migrations/20260603_marketplace_features.sql
```

Recommendation:
- Add a migration history table for production.
- Test migrations on staging before production.

## 9. Backup / Backup

Manual backup:
```bash
mysqldump -u marketplace_user -p --single-transaction --routines --triggers marketplace > marketplace_backup.sql
```

Upload backup:
```bash
tar -czf uploads_backup.tar.gz backend/uploads
```

See `BACKUP_GUIDE.md` for automated backup plans.

## 10. Restore / Restore

Database restore:
```bash
mysql -u marketplace_user -p marketplace < marketplace_backup.sql
```

Uploads restore:
```bash
tar -xzf uploads_backup.tar.gz -C /
```

## 11. Admin Security Checklist / Checklist Keamanan Admin

- Use strong admin passwords.
- Do not use seed admin credentials in production.
- Use HTTPS.
- Restrict admin access by network if possible.
- Review user activity regularly.
- Keep Node.js and npm packages patched.
- Back up database daily.
- Monitor failed login attempts.
- Store secrets outside Git.

## 12. Incident Response / Respons Insiden

If suspicious activity occurs:
1. Disable affected account.
2. Rotate JWT secret if token compromise is suspected.
3. Revoke refresh tokens from database.
4. Review server logs.
5. Check uploaded files.
6. Restore from clean backup if needed.
7. Document incident and remediation.
