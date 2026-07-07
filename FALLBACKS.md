# Fallback commands

Plain commands for every workshop step an assistant performs. If an
assistant misbehaves, run the matching command with curl and rejoin at the
next checkpoint. Every checkpoint is verified in the Unleash UI, so it does
not matter whether an assistant or a command got you there.

All commands on this page were verified on 2026-07-03 against a hosted
Unleash Enterprise instance, version 8.0.4.

## Before you start

The commands use four shell variables. Set them once per terminal session.
`UNLEASH_URL` is already the workshop instance; replace only the token and
project id:

```bash
export UNLEASH_URL="https://us.app.unleash-hosted.com/uspp0039"
export UNLEASH_PAT="user:xxxxxxxxxxxxxxxx"
export PROJECT_ID="your-project-id"
export FLAG="premium-upsell-$PROJECT_ID"
```

Flag names are unique across the whole instance, so every attendee's Premium
flag carries their project id. `FLAG` above matches the name your assistant
creates from the repo guidance.

Rules that apply to every command:

- `UNLEASH_URL` is the instance URL with no trailing `/api`. The paths
  below add it.
- `UNLEASH_PAT` is your personal access token. It starts with `user:`. Pass
  it in the `Authorization` header with no `Bearer` prefix.
- `PROJECT_ID` is your project's id, not its display name. Open your project
  in the Unleash UI and copy the id from the URL, or list projects with the
  first command below.
- A `401` response means the token is wrong. Check that you are using the
  personal access token, not the backend Client token, and that it has not
  expired.

## Find your project id

Projects on the workshop instance are named after attendees, and the id is
a slug derived from the name. List all projects and find yours:

```bash
curl -s -H "Authorization: $UNLEASH_PAT" \
  "$UNLEASH_URL/api/admin/projects" | python3 -c \
  "import json,sys; [print(p['id'], '->', p['name']) for p in json.load(sys.stdin)['projects']]"
```

## Create the Embeddr Premium flag

Creates a release flag, off by default. Expected response: `201`. A `409`
means the name is taken, live or archived, somewhere on the instance; check
the `FLAG` variable carries your project id.

```bash
curl -s -X POST "$UNLEASH_URL/api/admin/projects/$PROJECT_ID/features" \
  -H "Authorization: $UNLEASH_PAT" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$FLAG\", \"type\": \"release\", \"description\": \"Premium upsell call to action in the match grid\"}"
```

## Add a 100 percent rollout strategy in development

Adds a gradual rollout strategy at 100 percent to the development
environment. Expected response: `200`.

```bash
curl -s -X POST "$UNLEASH_URL/api/admin/projects/$PROJECT_ID/features/$FLAG/environments/development/strategies" \
  -H "Authorization: $UNLEASH_PAT" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"flexibleRollout\", \"parameters\": {\"rollout\": \"100\", \"stickiness\": \"default\", \"groupId\": \"$FLAG\"}}"
```

## Turn the flag on

Enables the flag in the development environment. Expected response:
`200`.

```bash
curl -s -X POST "$UNLEASH_URL/api/admin/projects/$PROJECT_ID/features/$FLAG/environments/development/on" \
  -H "Authorization: $UNLEASH_PAT"
```

## Turn the flag off

The kill. Verdicts stop being served within a few seconds. Expected
response: `200`.

```bash
curl -s -X POST "$UNLEASH_URL/api/admin/projects/$PROJECT_ID/features/$FLAG/environments/development/off" \
  -H "Authorization: $UNLEASH_PAT"
```

## Start over

If a flag got created wrong, archive it and delete it from the archive,
then create it again. Both steps matter: an archived flag keeps its name
reserved across the whole instance, so skipping the second command blocks
recreating the flag. Expected responses: `202`, then `200`.

```bash
curl -s -X DELETE "$UNLEASH_URL/api/admin/projects/$PROJECT_ID/features/$FLAG" \
  -H "Authorization: $UNLEASH_PAT"

curl -s -X DELETE "$UNLEASH_URL/api/admin/archive/$FLAG" \
  -H "Authorization: $UNLEASH_PAT"
```

Note for maintainers: the permanent delete endpoint is
`DELETE /api/admin/archive/{featureName}` on Unleash 8. Older documentation
shows `/api/admin/archive/features/{featureName}`, which returns `404` on
this version.
