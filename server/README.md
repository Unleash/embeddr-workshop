# Embeddr backend

A small Fastify service that evaluates every feature flag server-side and
reports the Ick impact metric. The frontend renders whatever this service
returns; it never talks to Unleash directly.

## Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness check, returns `{ ok: true }` |
| `POST /opener` | Evaluates `auto-rizz` for the session and returns a canned line or `null` |
| `POST /ick` | Counts a tap and increments the `ick_count` impact metric |

## Configuration

Copy `.env.example` to `.env` and fill in the values. Without Unleash
credentials the service still boots: every flag evaluates to off and the
app degrades to the plain Embeddr experience.

`METRICS_INTERVAL` is in milliseconds and controls how often the SDK sends
metrics, including impact metrics, to Unleash. Lower it for the live demo so
the safeguard sees Ick taps within seconds.

## Impact metric verification notes

Impact metrics and safeguards are beta features. The following was verified
on 2026-07-03 against a hosted Unleash instance (us.app.unleash-hosted.com)
with `unleash-client` 6.11.1.

- The server-side SDK registers a metric with
  `unleash.impactMetrics.defineCounter(name, help)` and reports with
  `unleash.impactMetrics.incrementCounter(name)`. The regular client returned
  by `initialize()` exposes `impactMetrics`; no separate client is needed.
- Impact metrics are batched with regular SDK metrics and sent on the
  `metricsInterval` cadence. Verified: with `METRICS_INTERVAL=5000`, taps
  appeared in the instance within seconds
  (`GET /api/admin/impact-metrics?metricName=ick_count&range=hour&aggregationMode=count&source=internal`).
- Naming: the docs define no constraints for internal metric names. Examples
  use Prometheus-style snake_case, so this service uses `ick_count`.
- Safeguards are configured in the Unleash UI on a flag environment or
  release plan milestone. The safeguard references the metric from a
  dropdown, with an aggregation mode (Rate or Count for counters) and a
  threshold over a time window. Nothing is required in code beyond
  reporting the metric.
- Gap between docs and observed behavior: the `help` text passed to
  `defineCounter` came back empty from
  `GET /api/admin/impact-metrics/metadata`; the UI display name falls back
  to the metric name. Cosmetic only.

Docs used:

- https://docs.getunleash.io/concepts/impact-metrics
- https://docs.getunleash.io/sdks/node
