import { isEnabled } from '../unleash.js';

export default async function qrRoutes(app) {
  app.post('/qr-code', async (request, reply) => {
    const { sessionId } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    if (!isEnabled('show-QR-code', { sessionId })) {
      return { qrCode: null };
    }

    return { qrCode: '/qr.png' };
  });
}
