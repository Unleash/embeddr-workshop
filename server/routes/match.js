import { getVariant, recordMatch } from '../unleash.js';

export default async function matchRoutes(app) {
  app.post('/match', async (request, reply) => {
    const { sessionId, userId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    // Same context as /layout, so the tap is credited to the layout this
    // session actually sees. Taps outside the experiment count nothing.
    const context = userId ? { sessionId, userId } : { sessionId };
    const variant = getVariant('match-layout-experiment', context);
    if (variant.enabled) recordMatch(variant.name);

    return { ok: true };
  });
}
