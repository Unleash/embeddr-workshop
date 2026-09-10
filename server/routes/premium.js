import { isEnabled } from '../unleash.js';

export default async function premiumRoutes(app) {
  app.post('/premium', async (request, reply) => {
    const { sessionId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    if (!isEnabled('premium-upsell', { sessionId })) {
      return { premium: null };
    }

    return {
      premium: {
        eyebrow: 'embeddr premium',
        headline: 'Six matches is a small sample size',
        body: 'Premium unlocks the rest of the checkpoint. Larger context windows, stranger architectures, one model that only speaks in embeddings.',
        cta: 'Upgrade to Premium',
      },
    };
  });
}
