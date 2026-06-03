# Docker Guide

## Files
- `Dockerfile.backend` builds the Express API image.
- `Dockerfile.frontend` builds the Vite frontend and serves it with Nginx.
- `docker-compose.yml` runs MySQL, backend, and frontend together.

## Run Locally
```bash
docker compose up --build
```

Open `http://localhost:8080` for the frontend and `http://localhost:5000/api/health` for the backend health check.

## Stop
```bash
docker compose down
```

## Volumes
`mysql_data` stores database files. `backend_uploads` stores uploaded files. Removing volumes deletes persisted data.

## Production Notes
Use external secrets, persistent storage, SSL reverse proxy, and managed database or backup automation for production.
