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

## The flags

Every flag is evaluated in the backend with the session id as Unleash context.

This demo is designed to work with the workshop Unleash instance. If you do not have
access to that instance, you can replicate the flags in your own instance
or a [free trial of Unleash](https://www.getunleash.io/pricing), using the
setup column below.

| Flag | What it does | Setup |
|------|--------------|-------|
| `auto-rizz` | Serves an opening line on every match card. Ick taps feed the `thumbs_down_count` impact metric that a safeguard watches in production. | Release flag, gradual rollout at 100%, default stickiness. The metric and safeguard are optional extras. |
| `premium-upsell` | Adds an Embeddr Premium call to action to the match grid, inviting the user to subscribe to see more models. | Release flag, gradual rollout at 100%, no targeting. |
| `light-mode` | Puts a theme toggle in the header. The light or dark choice is the user's own, per session; the flag only decides whether the control exists. Flag off hides the toggle and the app repaints dark. | Release flag, gradual rollout at 100%, no targeting. |
| `match-layout-experiment` | A/B on how matches are browsed: variant `list` keeps the classic card grid, variant `deck` shows one profile at a time with Pass and Match advancing the deck. Match taps feed the `match_count_list` and `match_count_deck` impact metrics, the experiment's success metric. | Experiment flag, gradual rollout at 100% with variants `list` and `deck` at 50/50, default stickiness. |
| `early-access` | The waitlist. Off shows the coming soon page to everyone; the invite code a visitor types is the Unleash userId. | Release flag. Target a single invite code to let one person in, then a gradual rollout with userId stickiness to open the doors in slices. |

With the flags off, or without an Unleash connection at all, the app is
the coming soon page: `early-access` holds everyone at the waitlist until
it serves their invite code. Behind the gate, the rest of the flags off
means plain Embeddr: six cards, no openers, no upsell.

## The pieces

| Path | What it is |
|------|------------|
| [`src/`](src/) | The frontend. No Unleash SDK, no flag logic, no token. |
| [`server/`](server/) | The backend. Flag evaluation, openers, the ick impact metric. See [`server/README.md`](server/README.md). |
| [`WORKBOOK.md`](WORKBOOK.md) | The attendee workbook. Start here at the workshop. |
| [`FALLBACKS.md`](FALLBACKS.md) | Plain commands for every assistant-driven step. |
| [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md) | Guidance for AI assistants working in this repo. |
