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

// Optional identity: visiting with ?user=mel tags this browser with a
// userId, so strategies can target a person by constraint instead of a
// random session. Persisted the same way as the session id.
function initUserId() {
  const fromQuery = new URLSearchParams(window.location.search).get('user');
  if (fromQuery) {
    document.cookie = `embeddr_user=${fromQuery}; path=/; max-age=86400; SameSite=Lax`;
    return fromQuery;
  }
  const match = document.cookie.match(/(?:^|; )embeddr_user=([^;]+)/);
  return match ? match[1] : null;
}

const userId = initUserId();

async function post(path, body) {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId, ...(userId && { userId }), ...body }),
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

export function reportMatch() {
  return post('/match', {});
}

export async function fetchThemeToggle() {
  const data = await post('/theme', {});
  return data?.themeToggle ?? false;
}

export async function fetchLayout() {
  const data = await post('/layout', {});
  return data?.layout ?? null;
}

export async function fetchAccess(inviteCode) {
  const data = await post('/access', { inviteCode });
  return data?.access ?? false;
}