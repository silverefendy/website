# Multi-User Marketplace Scaffold

This repository contains a monorepo scaffold for a multi-user marketplace web application with separate frontend and backend projects.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand, React Router v6, Axios
- Backend: Node.js, Express.js, JWT, Multer, bcrypt
- Database: MySQL

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  routes/
  scripts/
  uploads/
frontend/
  src/
    api/
    components/
    config/
    pages/
    stores/
```

## Environment Setup

Copy the example environment files before running either app:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

All deployment-specific values such as URLs, support details, site labels, currency settings, database credentials, JWT settings, and upload paths are read from environment variables.

## Backend

```bash
cd backend
npm install
npm run dev
```

The backend exposes a health check at `/api/health` and serves uploaded files from `/uploads`.

To execute a SQL migration file:

```bash
cd backend
npm run migrate -- ./path/to/file.sql
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server proxies `/api` requests to the backend URL configured in the frontend environment file.
