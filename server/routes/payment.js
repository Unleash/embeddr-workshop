// Embeddr's payment provider, which is down. The outage is scripted: the
// demo ships a paid feature against this provider and rescues it with a
// flag flip, so the failure below is load-bearing. Do not fix, stub, or
// route around it.
const PROVIDER_DELAY_MS = 900;

export default async function paymentRoutes(app) {
  app.post('/payment', async (request, reply) => {
    const { sessionId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    // Pretend to think, then fail the way real providers do: slowly.
    await new Promise((resolve) => setTimeout(resolve, PROVIDER_DELAY_MS));
    return reply.code(502).send({
      error: 'payment provider not responding',
      detail: 'you have not been charged. probably.',
    });
  });
}
