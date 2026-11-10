# AdminPro Dashboard

AdminPro is a React dashboard with a browser-only demo mode. User records and
the demo login are stored locally in the browser; no API server or database is
needed to run the frontend.

## Run the demo

```sh
npm install
npm run dev
```

Sign in with `admin@example.com` and `password123`, or use **Sign in with demo
account**. User changes are stored in the browser's local storage.

## Optional API backend

The Express/MongoDB API is retained under `backend/` but is not connected to the
frontend in demo mode. To run it independently, install its dependencies with
`npm install --prefix backend`, copy `backend/.env.example` to `backend/.env`,
configure MongoDB and unique secret/admin credentials, then run `npm run
seed:admin` and `npm run dev:api`. Do not commit `backend/.env`.

The revenue and sales charts use sample data.

## Checks

```sh
npm run build
npm run lint
```
