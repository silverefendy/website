# Frequently Asked Questions

## Who is this application for?
It is for marketplace operators, sellers, customers, developers, IT support teams, and system administrators.

## Can it run in production?
Yes, but production should include HTTPS, strong secrets, tested backups, monitoring, audit logs, and dependency patching.

## Which database is required?
MySQL 8.0 is recommended. MariaDB may work when compatible with the schema constraints and indexes.

## Where are uploads stored?
Uploads are stored in `UPLOAD_DIR`, defaulting to `uploads/`, and are exposed by the backend at `/uploads`.

## What are best practices?
Use separate environments, do not commit `.env`, keep package locks synchronized, test migrations on staging, and back up database and uploads together.
