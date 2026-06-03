# Backup Guide

## Scope
Back up MySQL data, uploaded files, environment configuration stored outside Git, Nginx configuration, and PM2 process configuration.

## Manual MySQL Backup
```bash
mkdir -p ~/backups
mysqldump -u marketplace_user -p --single-transaction --routines --triggers marketplace > ~/backups/marketplace_$(date +%F_%H%M%S).sql
```

## Compress Backup
```bash
gzip ~/backups/marketplace_YYYY-MM-DD_HHMMSS.sql
```

## Restore Database
```bash
mysql -u marketplace_user -p marketplace < marketplace_backup.sql
```

## Upload Backup
```bash
tar -czf ~/backups/uploads_$(date +%F_%H%M%S).tar.gz backend/uploads
```

## Automated Backup
Create a cron job that runs a shell script for database dumps, upload archives, retention cleanup, and off-server transfer.

## Retention Policy
Keep daily backups for 14 days, weekly backups for 8 weeks, and monthly backups for 12 months. Test restores monthly.
