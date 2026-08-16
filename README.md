# Modern Portfolio (Vite + MERN + Admin CMS)

This repository contains one active full-stack portfolio setup:

- `frontend/` - Vite + React app (public site + admin UI)
- `backend/` - Express + MongoDB API (content CMS + auth)

The old root Create React App has been retired. Static seed data now lives in `frontend/public/profile`.

## Quick Start

### 1) Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Fill `MONGO_URI`, `JWT_SECRET`, and admin credentials
3. Run:
   - `cd backend`
   - `npm install`
   - `npm run seed`
   - `npm run dev`

### 2) Frontend
1. Copy `frontend/.env.example` to `frontend/.env`
2. Run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

### Admin Login
- URL: `/admin/login`
- Credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in backend env.

## Notes
- Profile JSON under `frontend/public/profile` is imported via `npm run seed` in backend.
- Resume is stored as a Google Drive URL in the `site-config` content section.
- Frontend SPA redirects are configured in `frontend/public/_redirects`.
