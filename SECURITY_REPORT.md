# Security Summary Report

## Authentication Upgrades

- Implemented an access token + refresh token architecture.
- Access tokens now expire after 15 minutes.
- Refresh tokens expire after 7 days and are stored server-side as SHA-256 hashes.
- Refresh token rotation is used: a refresh request revokes the old token and stores a new one.
- Logout invalidates refresh tokens so stolen/old refresh tokens can no longer be used.
- Refresh tokens are also sent as HTTP-only cookies for safer browser transport while remaining available in API payloads for existing clients.

## API Hardening

- Added Helmet security headers.
- Disabled the `x-powered-by` Express header.
- Added stricter CORS options with explicit allowed origins, credentials, methods, and headers.
- Added body size limits for JSON and URL-encoded payloads.
- Added authentication rate limiting for login, register, and refresh endpoints.
- Added recursive request sanitization for body, query, and route params.
- Kept consistent API response shapes through shared response/error helpers.

## Frontend Session Handling

- Access tokens are kept in session storage/in-memory state instead of long-lived `localStorage`.
- Refresh tokens are stored separately under a dedicated key and removed explicitly on logout.
- The Axios client automatically refreshes access tokens after a 401 response and retries the failed request.
- `localStorage.clear()` was removed to avoid deleting unrelated browser data.

## Vulnerabilities Fixed

- Long-lived access token exposure risk reduced by moving to 15-minute access tokens.
- Missing refresh-token invalidation fixed by storing and revoking refresh token hashes.
- Session persistence without forced login added via refresh token flow.
- Brute-force pressure on auth endpoints reduced with rate limiting.
- Missing security headers addressed with Helmet.
- Over-broad browser storage deletion fixed by removing only marketplace session keys.
- Unsanitized request strings reduced with recursive sanitization middleware.
- Production stack trace exposure avoided through centralized public error conversion.
