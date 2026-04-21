# Presto

A lightweight, web-based alternative to [slides.com](https://slides.com) for creating, editing, and presenting slide decks. Built with React on the frontend and a lightweight Node backend, deployable to Vercel.

## Features

- Register / login / logout with persistent sessions
- Dashboard listing all presentations with thumbnail, name, description, and slide count
- Create, rename, re-thumbnail, and delete presentations
- Per-slide editor with add/delete/reorder slides and keyboard navigation
- Slide elements: text, images, videos (YouTube embed), and syntax-highlighted code blocks (C / Python / JavaScript)
- Click-and-drag move & resize for every element; double-click to edit properties; right-click to delete
- Per-slide background (solid color, gradient, or image) with a default presentation-level background
- Font-family picker, slide transitions, slide re-arrangement, and revision history
- Preview mode in a separate tab with URL-synced slide number
- Deployable to Vercel (frontend + backend)

## Project structure

```
Presto/
├── frontend/         # React + Vite app (MUI, react-router)
├── backend/          # Node API server (see swagger.json)
├── util/             # Setup scripts
└── assets/           # Shared assets
```

## Getting started

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the backend URL from [frontend/backend.config.json](frontend/backend.config.json).

## Scripts

From `frontend/`:

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run test` — run Vitest

## Tech stack

- **Frontend:** React 18, Vite, MUI, react-router-dom, react-syntax-highlighter, html2canvas
- **Backend:** Node.js, Express-style API (see [backend/swagger.json](backend/swagger.json))
- **Testing:** Vitest, @testing-library/react
- **Deploy:** Vercel
