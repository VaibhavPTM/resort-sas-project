# Hotel Management – Frontend

React frontend for the Hotel Management System. Login, signup, and a simple dashboard.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:3000` (or set Vite proxy in `vite.config.js`)

## Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. The dev server proxies `/api` to the backend.

## Scripts

- `npm run dev` – Start dev server (port 5173)
- `npm run build` – Production build
- `npm run preview` – Preview production build

## Routes

- `/login` – Sign in (email/password)
- `/signup` – Create account
- `/dashboard` – Protected; shows after login. Sign out here.

Unauthenticated visits to `/dashboard` (or `/`) redirect to `/login`.

## Environment

No `.env` required for local dev; API is proxied to `http://localhost:3000`. For a different backend, update the `proxy` target in `vite.config.js` or use `VITE_API_URL` and change the API client to use it.
