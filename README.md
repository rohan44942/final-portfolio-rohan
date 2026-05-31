# Modern Portfolio (Vite + MERN + Admin CMS)

This repository now contains a modernized full-stack portfolio setup:

- `frontend/` - Vite + React app (public site + admin UI)
- `backend/` - Express + MongoDB API (content CMS + auth + resume upload)

## Quick Start

### 1) Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Fill `MONGO_URI`, `JWT_SECRET`, and admin credentials
3. Optional: add Cloudinary env vars for resume storage
4. Run:
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
- Existing legacy JSON under `public/profile` is imported via `npm run seed` in backend.
