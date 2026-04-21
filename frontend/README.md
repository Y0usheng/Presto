# Presto — Frontend

React + Vite single-page app for Presto, a lightweight slide-authoring tool.

## Stack

- React 18 + Vite
- MUI (`@mui/material`, `@mui/icons-material`) and Emotion for styling
- `react-router-dom` for routing
- `react-syntax-highlighter` for in-slide code highlighting
- `html2canvas` for thumbnail generation
- Vitest + `@testing-library/react` for tests

## Setup

```bash
npm install
npm run dev
```

The dev server runs on Vite's default port (5173). The backend URL is read from [backend.config.json](backend.config.json) — update it to point to your local or deployed backend.

## Scripts

- `npm run dev` — start the dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint (must pass with no errors or warnings)
- `npm run test` — run Vitest

## Project layout

```
frontend/
├── src/
│   ├── components/   # reusable UI (modals, element editors, etc.)
│   ├── pages/        # route-level pages (Login, Dashboard, Presentation, Preview)
│   ├── __test__/     # Vitest component tests
│   └── main.jsx      # app entry
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
└── backend.config.json
```
