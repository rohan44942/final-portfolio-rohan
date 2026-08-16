# API Routes

## Public
- `GET /health`
- `GET /api/content/bootstrap` (home + social + navbar + siteConfig in one response)
- `GET /api/content/:section` (`home`, `about`, `skills`, `education`, `experience`, `social`, `navbar`, `routes`, `site-config`)
- `GET /api/content/projects`

## Auth
- `POST /api/auth/login`
- `GET /api/auth/me` (requires Bearer token)

## Admin (Bearer token required)
- `PUT /api/admin/content/:section`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
