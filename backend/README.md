# Hotel Management System – Backend

Node.js, Express, and MongoDB backend with JWT authentication and Google OAuth support.

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running (default port used: `27027` as per your requirement)
- (Optional) Google Cloud project for OAuth

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Copy the example env file and edit as needed:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27027/hotel_management` |
| `JWT_SECRET` | Secret for signing JWTs (use a strong random value in production) | — |
| `JWT_EXPIRES_IN` | Access token expiry | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | — |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |

### 3. Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create OAuth 2.0 Client ID (Web application).
3. Add authorized JavaScript origins (e.g. `http://localhost:5173`).
4. Put Client ID and Client Secret in `.env`.

If these are not set, `POST /api/auth/google` will return 503.

### 4. Run the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000` by default.

---

## API Reference

Base URL: `http://localhost:3000` (or your `PORT`).

### Health

- **GET** `/health`  
  Returns `{ status: "ok", timestamp }`. No auth.

### Authentication

#### Signup

- **POST** `/api/auth/signup`  
  **Body:** `{ "email": "user@example.com", "password": "min6chars", "name": "Optional Name" }`  
  **Response:** `{ success, message, data: { user, token, refreshToken } }`

#### Login (email/password)

- **POST** `/api/auth/login`  
  **Body:** `{ "email": "user@example.com", "password": "..." }`  
  **Response:** `{ success, message, data: { user, token, refreshToken } }`

#### Google OAuth

- **POST** `/api/auth/google`  
  **Body:** `{ "credential": "<google_id_token>" }`  
  Frontend should obtain `credential` from the Google Sign-In library (e.g. One Tap or button).  
  **Response:** `{ success, message, data: { user, token, refreshToken } }`

#### Current user (protected)

- **GET** `/api/auth/me`  
  **Headers:** `Authorization: Bearer <token>`  
  **Response:** `{ success, message, data: { user } }`

### Using the token

Send the JWT in one of these ways:

- **Header:** `Authorization: Bearer <your-jwt>`
- **Cookie:** `token=<your-jwt>` (if using cookie-based auth)

---

## Project structure

```
backend/
├── src/
│   ├── config/         # App config, DB connection
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth, error handling
│   ├── models/         # Mongoose models (User)
│   ├── routes/         # Route definitions
│   ├── utils/          # JWT, API response helpers
│   ├── validators/     # express-validator rules
│   ├── app.js          # Express app
│   └── index.js        # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Security notes

- Passwords are hashed with **bcrypt** (salt rounds 12) before storage.
- JWTs are signed with `JWT_SECRET`; set a long, random secret in production.
- Use HTTPS in production.
- CORS is restricted to `FRONTEND_URL`.
- No forgot/reset password flow is implemented in this module.

## Database

- Default DB: `hotel_management` on `mongodb://localhost:27027`.
- User collection: `users` (created by Mongoose).
- Ensure MongoDB is running on port `27027` before starting the server.
