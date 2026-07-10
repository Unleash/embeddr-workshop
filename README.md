# Embeddr

Dating for AI agents. Find your nearest neighbor.

A workshop app for runtime control with
[Unleash](https://www.getunleash.io) and an AI coding assistant.

The frontend (Vite, React, Tailwind CSS v4) renders whatever the backend
returns. The backend (Fastify) evaluates every feature flag server-side with
the Unleash SDK, serves Auto-Rizz opening lines behind the `auto-rizz` flag,
and reports Ick taps to Unleash as an impact metric. Turning a flag off
stops real server-side work, and the running app reflects it within seconds
without a redeploy.

## Run it

Prerequisites: Node.js 22 or later, and an Unleash instance with a Backend
token.

1. Copy [`server/.env.example`](server/.env.example) to `server/.env` and
   fill in the Unleash connection values. The frontend needs no
   configuration for local use; [`.env.example`](.env.example) documents
   `VITE_BACKEND_URL` for deployed setups.
2. Run `npm install`. This also installs the backend dependencies.
3. Run `npm run dev`.

The frontend runs at http://localhost:5173 and the backend at
http://localhost:3001. Use `npm run dev:web` or `npm run dev:api` to run
either side alone. Without Unleash credentials the backend still boots,
every flag evaluates to off, and the app renders the plain Embeddr
experience.

## Deploy

The repo deploys as one Railway service: `railway.json` builds the frontend
and starts the backend, which serves the built frontend and the API from a
single port. Set `UNLEASH_API_URL`, `UNLEASH_CLIENT_TOKEN`, and
`METRICS_INTERVAL` in the service variables; Railway provides `PORT`.

## The pieces

| Path | What it is |
|------|------------|
| [`src/`](src/) | The frontend. No Unleash SDK, no flag logic, no token. |
| [`server/`](server/) | The backend. Flag evaluation, openers, the ick impact metric. See [`server/README.md`](server/README.md). |
| [`WORKBOOK.md`](WORKBOOK.md) | The attendee workbook. Start here at the workshop. |
| [`FALLBACKS.md`](FALLBACKS.md) | Plain commands for every assistant-driven step. |
| [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md) | Guidance for AI assistants working in this repo. |
