# DOCKER_GUIDE.md

# Docker Guide / Panduan Docker

## Files

- `Dockerfile.backend`: builds Express API image.
- `Dockerfile.frontend`: builds Vite frontend and serves it with Nginx.
- `docker-compose.yml`: runs MySQL, backend, and frontend together.

## Dockerfile.backend Explanation

Stages:
1. Uses Node.js Alpine image.
2. Sets working directory to `/app`.
3. Copies package files.
4. Installs dependencies.
5. Copies backend source.
6. Exposes API port 5000.
7. Runs `npm start`.

## Dockerfile.frontend Explanation

Stages:
1. Build stage uses Node.js Alpine.
2. Installs frontend dependencies.
3. Builds static assets with Vite.
4. Runtime stage uses Nginx Alpine.
5. Copies `dist` to Nginx HTML root.
6. Uses Nginx to serve SPA.

## docker-compose.yml Explanation

Services:
- `db`: MySQL database with persistent volume.
- `backend`: Express API connected to database.
- `frontend`: Static frontend served by Nginx.

Volumes:
- `mysql_data`: persistent MySQL data.
- `backend_uploads`: persistent uploaded files.

Network:
- `marketplace_net`: private bridge network.

## Run locally

```bash
docker compose up --build
```

Open:
```text
Frontend: http://localhost:8080
Backend: http://localhost:5000/api/health
```

## Stop

```bash
docker compose down
```

## Stop and remove volumes

```bash
docker compose down -v
```

Warning: removing volumes deletes database and uploads.

## Run migration inside container

```bash
docker compose exec backend npm run migrate -- ../schema.sql
```

## Production recommendations

- Do not store production secrets directly in compose file.
- Use Docker secrets or environment management.
- Use external managed MySQL for high availability.
- Put Nginx/Traefik/Caddy reverse proxy in front for SSL.
- Persist uploads to object storage.
