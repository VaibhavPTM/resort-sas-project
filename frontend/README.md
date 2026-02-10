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

- **API:** No `.env` required for local dev; API is proxied to `http://localhost:3000`.
- **Google Sign-In:** To show the "Sign in with Google" button, copy `.env.example` to `.env` and set `VITE_GOOGLE_CLIENT_ID` to the same value as the backend's `GOOGLE_CLIENT_ID` (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)). Restart the dev server after changing env.
