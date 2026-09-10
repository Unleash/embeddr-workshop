import { initialize } from 'unleash-client';

// Flag refresh interval in milliseconds. 5s keeps a flag toggle visible in
// the app within seconds without hammering the instance from a room full
// of backends.
const REFRESH_INTERVAL = 5000;

// Impact metric for Ick taps. Counters only go up; the safeguard watches the
// rate over a short window. Reported on the METRICS_INTERVAL cadence.
const THUMBS_DOWN_METRIC = 'thumbs_down_count';

// Impact metrics for Match taps, one counter per layout variant so the two
// lines sit side by side on a graph. Fed by the /match route.
const MATCH_METRICS = {
  list: 'match_count_list',
  deck: 'match_count_deck',
};

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

  client.impactMetrics.defineCounter(THUMBS_DOWN_METRIC, 'Thumbs down taps on Auto-Rizz openers');
  client.impactMetrics.defineCounter(MATCH_METRICS.list, 'Match taps in the list layout');
  client.impactMetrics.defineCounter(MATCH_METRICS.deck, 'Match taps in the deck layout');

  return client;
}

// Evaluates a flag with the given Unleash context. Returns false when the
// client never started, so routes need no awareness of the degraded mode.
export function isEnabled(flagName, context) {
  return client ? client.isEnabled(flagName, context) : false;
}

// Evaluates a flag's variant with the given Unleash context. Returns the
// built-in disabled variant when the client never started, matching what the
// SDK returns for an unknown or disabled flag.
export function getVariant(flagName, context) {
  return client
    ? client.getVariant(flagName, context)
    : { name: 'disabled', enabled: false, feature_enabled: false };
}

// Reports one Ick tap to Unleash. A no-op in degraded mode, so the endpoint
// keeps answering even without an Unleash connection.
export function recordIck() {
  if (client) client.impactMetrics.incrementCounter(THUMBS_DOWN_METRIC);
}

// Reports one Match tap under the layout variant that served it. A no-op in
// degraded mode or for a variant without a counter.
export function recordMatch(variantName) {
  const metric = MATCH_METRICS[variantName];
  if (client && metric) client.impactMetrics.incrementCounter(metric);
}

export function getClient() {
  return client;
}
