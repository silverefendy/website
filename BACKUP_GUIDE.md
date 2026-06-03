# BACKUP_GUIDE.md

# Backup Guide / Panduan Backup

## What to Back Up / Yang Harus Dibackup

1. MySQL database.
2. Upload directory/object storage.
3. Environment variables (stored securely, not in Git).
4. Nginx and PM2 configuration.

## Manual MySQL Backup

```bash
mkdir -p ~/backups
mysqldump -u marketplace_user -p --single-transaction --routines --triggers marketplace > ~/backups/marketplace_$(date +%F_%H%M%S).sql
```

Explanation:
- `mysqldump` exports database.
- `--single-transaction` provides consistent InnoDB snapshot.
- `--routines --triggers` includes stored routines/triggers if added later.

## Compress Backup

```bash
gzip ~/backups/marketplace_YYYY-MM-DD_HHMMSS.sql
```

## Restore MySQL Backup

```bash
mysql -u marketplace_user -p marketplace < marketplace_backup.sql
```

If compressed:
```bash
gunzip -c marketplace_backup.sql.gz | mysql -u marketplace_user -p marketplace
```

## Upload Backup

```bash
tar -czf ~/backups/uploads_$(date +%F_%H%M%S).tar.gz backend/uploads
```

## Restore Uploads

```bash
tar -xzf uploads_backup.tar.gz -C /var/www/marketplace
```

## Automated Backup with Cron

Create script `/usr/local/bin/marketplace-backup.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR=/var/backups/marketplace
APP_DIR=/var/www/marketplace
DB_NAME=marketplace
DB_USER=marketplace_user
DATE=$(date +%F_%H%M%S)
mkdir -p "$BACKUP_DIR"
mysqldump -u "$DB_USER" -p"$DB_PASSWORD" --single-transaction --routines --triggers "$DB_NAME" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C "$APP_DIR" backend/uploads
find "$BACKUP_DIR" -type f -mtime +14 -delete
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/marketplace-backup.sh
```

Cron daily at 02:00:
```bash
sudo crontab -e
```

```cron
0 2 * * * DB_PASSWORD='StrongPassword123!' /usr/local/bin/marketplace-backup.sh >> /var/log/marketplace-backup.log 2>&1
```

## Retention Policy

Recommended:
- Daily backups: keep 14 days.
- Weekly backups: keep 8 weeks.
- Monthly backups: keep 12 months.
- Store copies off-server.

## Backup Testing

Monthly restore test:
1. Create temporary database.
2. Restore latest backup.
3. Run basic queries.
4. Verify uploads archive extracts.
5. Document result.

## Indonesian Notes

Backup tidak dianggap valid sampai pernah diuji restore. Simpan backup di lokasi berbeda dari server utama.
