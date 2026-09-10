import { getVariant } from '../unleash.js';

export default async function layoutRoutes(app) {
  app.post('/layout', async (request, reply) => {
    const { sessionId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    // The session id keeps the split sticky: a phone that draws the deck
    // keeps the deck while the room compares. Flag off or no variants
    // configured means the built-in disabled variant, so the frontend falls
    // back to the classic grid.
    const variant = getVariant('match-layout-experiment', { sessionId });
    return { layout: variant.enabled ? variant.name : null };
  });
}
