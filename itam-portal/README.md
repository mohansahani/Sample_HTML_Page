# IT Asset Management (ITAM) Portal

Monorepo containing backend (Node/Express/MongoDB) and frontend (React/Vite/Tailwind).

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start (Local)
1. Backend
   - `cp backend/.env.example backend/.env`
   - `cd backend && npm install && npm run dev`
2. Frontend
   - `cp frontend/.env.example frontend/.env`
   - `cd frontend && npm install && npm run dev`
3. Login with default admin from backend `.env`.

## Docker (Local, all-in-one)
```
# from repo root
docker compose up -d --build
# Frontend at http://localhost:5173, Backend at http://localhost:5000
```

## Render Deployment
- Create a MongoDB Atlas cluster; copy the connection string.
- Push this repo to GitHub.
- On Render:
  - New Blueprint, select repo; Render will read `render.yaml`.
  - Set env vars for backend service:
    - `MONGODB_URI` = your Atlas URI
    - `JWT_SECRET` = a strong random string
    - Optionally adjust `CORS_ORIGIN` to the Render static site URL
  - Deploy. Frontend will be built as static site; set `VITE_API_URL` if you rename services.

## Bulk Import
Sample CSV at `backend/src/docs/sample-assets.csv`. Use the Assets page Upload control.

## Auth
Default admin is seeded from backend env on first run.