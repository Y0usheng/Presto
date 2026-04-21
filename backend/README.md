# Presto — Backend

Lightweight Express API that backs the Presto frontend. Handles authentication and persistence of presentations, slides, and thumbnails.

## Stack

- Node.js + Express
- JWT-based auth (`jsonwebtoken`)
- `async-lock` for serialized writes
- `@vercel/blob` + `@vercel/kv` for storage when deployed to Vercel
- Local fallback storage in `database.json`
- Swagger UI for API docs (served from [swagger.json](swagger.json))
- Jest + Supertest for tests

## Setup

```bash
npm install
npm start
```

`npm start` runs the API via `nodemon` (entry: [api/index.js](api/index.js)) and watches for changes, ignoring `database.json` so local data isn't clobbered on each write.

## Scripts

- `npm start` — run the dev server with nodemon
- `npm test` — run the Jest test suite
- `npm run lint` — run ESLint over `api/`
- `npm run reset` — delete the local `database.json` (wipes all local data)
- `npm run build` — transpile `api/` with Babel into `dist/` and copy to `public/` (used for Vercel deploy)

## API

Full interface is documented in [swagger.json](swagger.json); once the server is running, Swagger UI is mounted by the app for interactive exploration.

## Storage

- **Local dev:** JSON file at `database.json` in this directory.
- **Vercel deploy:** Vercel KV for structured data, Vercel Blob for thumbnails — configured via [vercel.json](vercel.json) and the corresponding environment variables in the Vercel project.

## Deployment

Deployed as serverless functions on Vercel. See [vercel.json](vercel.json) for routing config.
