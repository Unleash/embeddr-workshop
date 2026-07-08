// Tiny client for the Embeddr backend. The frontend holds no flag logic:
// it asks the backend what to show and renders the answer.

// In dev the backend runs on its own port; in a production build the
// backend serves the frontend, so relative URLs hit the same origin.
// VITE_BACKEND_URL overrides both, for split-origin deployments.
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.DEV ? 'http://localhost:3001' : '');

function generateId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `s-${Math.random().toString(36).slice(2)}`;
}

// One session id per browser, so percentage rollouts are sticky. The cookie
// keeps it stable across reloads, but nothing breaks without it: a blocked
// cookie just means a fresh session next visit.
function initSessionId() {
  const match = document.cookie.match(/(?:^|; )embeddr_session=([^;]+)/);
  if (match) return match[1];
  const id = generateId();
  document.cookie = `embeddr_session=${id}; path=/; max-age=86400; SameSite=Lax`;
  return id;
}

const sessionId = initSessionId();

async function post(path, body) {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId, ...body }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    // Backend unreachable: the app renders like the original.
    return null;
  }
}

export async function fetchOpener(matchId, variant = 0) {
  const data = await post('/opener', { matchId, variant });
  return data?.opener ?? null;
}

export function reportIck() {
  return post('/ick', {});
}
