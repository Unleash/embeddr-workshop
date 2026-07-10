import { isEnabled } from '../unleash.js';
import { openers } from '../data/openers.js';

// Stable hash so a session keeps seeing the same line across polls instead of
// the bank reshuffling every few seconds.
function stablePick(seed, length) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
}

export default async function openerRoutes(app) {
  app.post('/opener', async (request, reply) => {
    const { sessionId, matchId, variant } = request.body ?? {};
    if (!sessionId) {
      return reply.code(400).send({ error: 'sessionId is required' });
    }

    // The session id in the context makes percentage rollouts sticky: a
    // session that receives Auto-Rizz keeps it as the rollout climbs.
    if (!isEnabled('auto-rizz', { sessionId })) {
      return { opener: null };
    }

    // variant walks the bank from the session's base line, so a reroll is
    // guaranteed to land on a different line and stays stable across polls.
    const parsed = Number(variant);
    const offset = Number.isFinite(parsed) ? Math.abs(Math.trunc(parsed)) : 0;
    const base = stablePick(`${sessionId}:${matchId ?? ''}`, openers.length);
    const line = openers[(base + offset) % openers.length];
    return { opener: line };
  });
}
