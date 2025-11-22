# RideConnect Campus Carpool

A full-stack RideConnect experience for NIT Calicut students. The project is now split into a React client and a Node.js/Express backend so you can manage authentication, rides, and driver data from a single codebase.

## Project Structure

```
.
├── client/   # Vite + React + TypeScript UI (Tailwind, shadcn/ui, React Query)
└── server/   # Express + TypeScript API (JWT auth, JSON-file persistence)
```

The API owns the source of truth for rides, driver profiles, and sign-ups. The UI consumes those endpoints via a lightweight fetch wrapper and React Query.

## Prerequisites

- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm) or the official installers)
- npm (ships with Node). You can swap npm for pnpm/yarn if you prefer—just regenerate the lockfiles inside each package.

## Environment Variables

### Client

Create `client/.env` from the template:

```
cp client/.env.example client/.env
```

`VITE_API_URL` should point at the backend API (defaults to `http://localhost:5000/api`).

### Server

Create `server/.env` from the template:

```
cp server/.env.example server/.env
```

You can customize:

- `PORT` – API port (default `5000`).
- `CLIENT_ORIGIN` – allowed CORS origin for the React dev server.
- `JWT_SECRET` – secret used to sign access tokens.
- `MONGODB_URI` – MongoDB Atlas (or any MongoDB) connection string used by the API.

## Installation & Local Development

Install dependencies for each workspace once:

```bash
# Client dependencies
cd client
npm install

# Server dependencies
cd ../server
npm install
```

Run both apps in separate terminals:

```bash
# Terminal 1 – backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 – frontend (http://localhost:5173)
cd client
npm run dev
```

The client uses `VITE_API_URL` to talk to the API, so make sure the backend is running before testing forms such as “Post Ride” or “Join Ride”.

### Production Builds

- Client: `cd client && npm run build && npm run preview`
- Server: `cd server && npm run build && npm start`

## Backend Overview

- **Auth**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me` with JWT tokens + bcrypt hashes stored in MongoDB.
- **Rides**: `/api/rides` (list), `POST /api/rides` (create, requires auth), `POST /api/rides/:rideId/join` (reserve a seat). Rides + participants live in MongoDB and are tied to the posting user.
- **Drivers**: `GET /api/drivers` returns the curated driver list stored in MongoDB.

On the first boot, the API seeds the MongoDB collections with the sample rides and drivers from `server/data/*.json` so you still get rich demo data. Delete the relevant documents if you’d like to re-seed.

## Frontend Overview

- React Router pages for Landing, Rides, Post Ride, Find Driver, My Rides, Auth, etc.
- `@tanstack/react-query` keeps ride/driver data fresh and invalidates lists after mutations.
- Auth context stores `{ user, token }` in `localStorage` and re-validates the token via `/api/auth/me` on load.
- Pages that previously used mock data now read/write through the API:
  - **Rides** fetches live data, filters client-side, and opens a modal to join seats.
  - **Post Ride** requires an authenticated user and persists rides to the backend.
  - **Find Driver** pulls verified driver profiles from the API and surfaces contact info.
  - **My Rides** separates rides you host vs. rides you have joined using server data.

## Tips

- If you need to reset the backend state, delete the JSON files under `server/data` (they will be re-created with seed data on next boot).
- Adjust `CLIENT_ORIGIN` and `VITE_API_URL` when deploying to ensure CORS and fetch URLs stay in sync.
- The API currently stores sessions with JWTs only; no refresh tokens or cookies are set. Include the `Authorization: Bearer <token>` header for any protected route.

Happy hacking! Let me know if you want deployment scripts (Docker, Railway, etc.) or automated tests next.
