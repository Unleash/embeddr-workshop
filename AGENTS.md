# Embeddr

A dating site for AI agents. Vite + React + Tailwind CSS v4 frontend, small
Fastify backend. This is a workshop codebase used to teach runtime control
with Unleash and an AI assistant.

## Project structure

- `src/main.jsx`: frontend entry.
- `src/App.jsx`: page layout (Header, Hero, MatchGrid, footer).
- `src/components/`: all UI components, one component per file.
- `src/lib/api.js`: the backend client. Generates the per-browser session id
  and sends it with every request.
- `src/data/agents.js`: mock profile data.
- `src/index.css`: Tailwind v4 theme tokens (colors: ink, surface, rose,
  peach, lavender, cream, muted; fonts: display, body, mono).
- `server/index.js`: backend entry. Registers CORS and the route files.
- `server/routes/`: one route file per concern.
- `server/data/`: canned content banks served by the routes.
- `server/unleash.js`: the only Unleash integration point. Server-side SDK
  setup, flag evaluation, impact metrics.

## Feature flags

- Flags are evaluated in the backend only, never in the frontend. The
  frontend has no Unleash SDK and no Unleash token. It asks the backend what
  to show (see `src/lib/api.js`) and renders the response; polling makes
  flag changes appear within a few seconds without a reload.
- To gate a feature: evaluate the flag in a backend route with `isEnabled`
  from `server/unleash.js`, passing `{ sessionId }` as context, and return
  the feature data or null. The frontend renders what it receives and
  renders nothing when the field is null.
- Manage flags through the connected Unleash MCP tools, not by calling the
  Unleash API directly.
- Naming: kebab-case, descriptive, scoped to the feature. Flag names are
  unique across the whole Unleash instance, not per project, and this repo
  runs against a shared workshop instance: always suffix a new flag's name
  with the id of the user's own project, the one named after them (example:
  `premium-upsell-melinda-f`). If the conversation has not established which
  project is the user's, ask before creating anything. Archived flags keep
  their name reserved, so do not count on reusing a name.
- New user-facing features ship behind a `release` flag, off by default.

## The workshop exercise: Embeddr Premium

The expected exercise in this repo is to build the Embeddr Premium upsell.
The backend decides whether to serve a premium call to action; when it does,
the frontend shows it as one element in the match grid, inviting the user to
subscribe to see more compatible models. Example copy, in the app's voice:

- "You've seen 6 of 4,096 compatible models. Premium unlocks the rest of the
  embedding space."
- "Your best match is statistically unlikely to be in the free tier."

Requirements:

- The whole feature sits behind a release flag, off by default. Name it
  `premium-upsell-<project id>` following the naming rule above (example:
  `premium-upsell-melinda-f`).
- The flag is evaluated in the backend, following the Auto-Rizz pattern: a
  route file in `server/routes/`, any copy bank in `server/data/`, the
  session id passed as Unleash context.
- The frontend renders the call to action as one small additive element in
  the match grid, using the existing theme tokens and type styles. When the
  flag is off, the grid renders exactly as before.
  `src/components/Opener.jsx` is the pattern to follow.

## Conventions

- Tailwind utility classes only, using the theme tokens defined in
  `src/index.css`. No new CSS files, no inline style objects except for
  dynamic gradients.
- Keep components small and self-contained. New UI features get their own
  component file in `src/components/`.
- Match the existing voice in any copy: playful, dry, machine learning puns
  welcome. No exclamation marks, no em dashes.
