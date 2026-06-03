# Security Guide

## Authentication
The system uses JWT access tokens and refresh tokens. Refresh token hashes are stored in MySQL and rotated during refresh.

## Authorization
Role middleware controls access for admin, seller, and customer areas. Frontend protected routes prevent accidental access to role-specific pages.

## JWT
Use a long random `JWT_SECRET`, short access-token lifetime, and secure refresh-token handling. Rotate secrets after suspected compromise.

## Password Security
Passwords are hashed with bcrypt. Production should enforce strong password rules, email verification, and password reset workflows.

## Upload Security
Uploads are limited by MIME type and size. Production should validate magic bytes, re-encode images, scan malware, and store files in object storage.

## OWASP Risks
Key risks include broken access control, injection, XSS, CSRF, insecure file upload, and insufficient logging. Use validation, parameterized SQL, strict CORS, HTTPS, audit logs, and dependency scanning.
