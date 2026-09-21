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

    const providerDown = isEnabled('payment-provider-killswitch', { sessionId });

    return {
      premium: {
        eyebrow: 'embeddr premium',
        headline: 'Six matches is a small sample size',
        body: 'Premium unlocks the rest of the checkpoint. Larger context windows, stranger architectures, one model that only speaks in embeddings.',
        cta: providerDown ? null : 'Upgrade to Premium',
        notice: providerDown
          ? 'Checkout is paused while our payment provider converges. Your matches will wait, they have excellent patience parameters.'
          : null,
      },
    };
  });
}
