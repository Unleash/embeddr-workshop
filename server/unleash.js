import { initialize } from 'unleash-client';

// Flag refresh interval in milliseconds. Kept low so a flag turned off in the
// Unleash UI stops serving within a few seconds during the workshop.
const REFRESH_INTERVAL = 2000;

// Impact metric for Ick taps. Counters only go up; the safeguard watches the
// rate over a short window. Reported on the METRICS_INTERVAL cadence.
const ICK_METRIC = 'ick_count';

let client = null;

// Starts the server-side Unleash client. When the connection details are
// missing the backend still boots and every flag evaluates to off, so the app
// degrades to the plain Embeddr experience instead of crashing.
export function startUnleash(log) {
  const url = process.env.UNLEASH_API_URL;
  const token = process.env.UNLEASH_CLIENT_TOKEN;

  if (!url || !token) {
    log.warn(
      'UNLEASH_API_URL or UNLEASH_CLIENT_TOKEN is not set. ' +
        'Running without Unleash: all flags evaluate to off. ' +
        'Copy server/.env.example to server/.env and fill in your instance details.'
    );
    return null;
  }

  client = initialize({
    url,
    appName: 'embeddr-server',
    customHeaders: { Authorization: token },
    refreshInterval: REFRESH_INTERVAL,
    metricsInterval: Number(process.env.METRICS_INTERVAL) || 60000,
  });

  client.on('error', (err) => log.warn({ err: err.message }, 'unleash: client error'));
  client.on('warn', (msg) => log.warn(`unleash: ${msg}`));
  client.on('synchronized', () => log.info('unleash: flags synchronized'));

  client.impactMetrics.defineCounter(ICK_METRIC, 'Ick taps on Auto-Rizz openers');

  return client;
}

// Evaluates a flag with the given Unleash context. Returns false when the
// client never started, so routes need no awareness of the degraded mode.
export function isEnabled(flagName, context) {
  return client ? client.isEnabled(flagName, context) : false;
}

// Reports one Ick tap to Unleash. A no-op in degraded mode, so the endpoint
// keeps answering even without an Unleash connection.
export function recordIck() {
  if (client) client.impactMetrics.incrementCounter(ICK_METRIC);
}

export function getClient() {
  return client;
}
