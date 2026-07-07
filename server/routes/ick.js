import { recordIck } from '../unleash.js';

// Ick taps per session, in memory. The demo runs long enough for a rollout to
// pause, not long enough to need persistence.
const ickCounts = new Map();

export default async function ickRoutes(app) {
  app.post('/ick', async (request, reply) => {
    const { sessionId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    const taps = (ickCounts.get(sessionId) ?? 0) + 1;
    ickCounts.set(sessionId, taps);
    recordIck();
    request.log.info({ sessionId, taps }, 'ick recorded');

    return { ok: true };
  });
}
