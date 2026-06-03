# Administrator Guide

## User Management
Administrators manage accounts, investigate suspicious users, verify seller identity, and deactivate accounts when required. Production systems should add audit logs for every account-status change.

## Role Management
The current roles are admin, seller, and customer. Role IDs are stored in the `roles` table. Long-term deployments should evolve toward permission-based access instead of hard-coded role IDs.

## Maintenance
Routine maintenance includes dependency updates, database health checks, upload cleanup, disk monitoring, and review of application logs.

## Logs and Monitoring
Use PM2 logs for backend runtime issues, Nginx logs for proxy and SSL issues, and MySQL logs for database errors. Production should add centralized logging and alerting.

## Backup
Back up the MySQL database and upload directory together. Keep backup copies outside the server.

## Restore
Restore database dumps with `mysql` and upload archives with `tar`. Always test restore procedures in staging before production incidents.
