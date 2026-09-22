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

- Flags are evaluated in the backend only. The
  frontend has no Unleash SDK and no Unleash token. It asks the backend what
  to show (see `src/lib/api.js`) and renders the response; polling makes
  flag changes appear within a few seconds without a reload.
- To gate a feature: evaluate the flag in a backend route with `isEnabled`
  from `server/unleash.js`, passing `{ sessionId }` as context, and return
  the feature data or null. The frontend renders what it receives and
  renders nothing when the field is null.
- Every change in this repo runs through the Unleash MCP server, not the
  Unleash API or UI. Start with `evaluate_change` for a risk read, reuse
  any flag `detect_flag` surfaces, create new ones with `create_flag`, and
  guard code with `wrap_change`. Retire flags with `cleanup_flag`.
- Communicate the tool trail: in the final report, name each Unleash MCP
  tool that was called and what it did. The audience follows the demo
  through those calls.
- Naming: kebab-case, descriptive, scoped to the feature.
- New user-facing features ship behind a `release` flag, off by default.

## Payment provider

- `server/routes/payment.js` is Embeddr's payment provider, and it is down
  on purpose. POST `/payment` takes a `sessionId`, waits about a second,
  and returns a 502. The malfunction is part of the demo script, so never
  fix it, stub a success path, or route around it.
- Embeddr Premium is intentionally absent from this codebase. It gets vibe
  coded live during a demo, behind a release flag, with its upgrade flow
  charging through POST `/payment`.

## Conventions

- Tailwind utility classes only, using the theme tokens defined in
  `src/index.css`. No new CSS files, no inline style objects except for
  dynamic gradients.
- Keep components small and self-contained. New UI features get their own
  component file in `src/components/`.
- Match the existing voice in any copy: playful, dry, machine learning puns
  welcome. No exclamation marks, no em dashes.

## Live demo constraints

This repo is demoed in front of an audience: the assistant creating the flag
and wrapping the code IS the demo. Predictability beats thoroughness.

- The Unleash project is `embeddr-demo`. Pass it as `projectId` on every MCP
  call. Never stop to ask which project to use.
- Create the flag off and leave it off. The presenter does the live flip.
  Never enable an environment, add a strategy, or toggle anything.
- `npm run dev` is already running (web 5173, api 3001). Never start another
  server, run a build, or use another port.
- No screenshots, no installing tooling, no formatters. There is no Prettier
  config; match the style of the file you are editing.
- Smallest set of files. Fixed content returns inline from the route. Only
  add to `server/data/` when the copy has variants, like `openers.js`.
- Verification is the presenter's job. When confident the change works,
  finish and hand it over: the presenter flips the flag and checks the
  browser. At most one quick curl of the live path when genuinely unsure.
  Never hardcode a flag result to test the other path.
- Build from the current working tree only. No git history digging, no
  resurrecting deleted implementations; each demo run is written fresh.
- The frontend only shows what survives its polling guards. When a change
  alters the contents of a payload the frontend already receives, trace the
  field from route to component and confirm every stability or memo check
  passes content changes through, not just presence changes.
- Report in a few lines, naming the Unleash MCP tools used, no process
  narration.