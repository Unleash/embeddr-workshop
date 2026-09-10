import { isEnabled } from '../unleash.js';

export default async function accessRoutes(app) {
  app.post('/access', async (request, reply) => {
    const { sessionId, inviteCode } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    // The invite code rides as the Unleash userId, so targeting one code
    // admits one person and a gradual rollout with userId stickiness admits
    // the same codes as the percentage climbs. No code yet falls back to
    // session stickiness.
    const context = inviteCode
      ? { sessionId, userId: String(inviteCode) }
      : { sessionId };
    return { access: isEnabled('early-access', context) };
  });
}
