import { useEffect, useState } from 'react';
import { fetchAccess } from '../lib/api.js';
import ComingSoon from './ComingSoon.jsx';

// Same rhythm as the other flag-driven pieces: poll so a waitlisted phone
// pops into the app within seconds of the rollout reaching its code.
const POLL_INTERVAL = 3000;

function readCode() {
  try {
    return localStorage.getItem('embeddr_invite') ?? '';
  } catch {
    return '';
  }
}

// The whole app sits behind this gate. localStorage keeps the invite code
// across visits; a blocked store just means the rope asks again next time.
export default function AccessGate({ children }) {
  const [code, setCode] = useState(readCode);
  const [access, setAccess] = useState(false);

  useEffect(() => {
    if (!code) return undefined;
    let cancelled = false;

    const poll = async () => {
      const next = await fetchAccess(code);
      if (!cancelled) setAccess(next);
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [code]);

  const handleCode = (next) => {
    try {
      if (next) localStorage.setItem('embeddr_invite', next);
      else localStorage.removeItem('embeddr_invite');
    } catch {
      // Storage unavailable: the code still holds for this visit.
    }
    setAccess(false);
    setCode(next);
  };

  if (!code || !access) return <ComingSoon code={code} onCode={handleCode} />;
  return children;
}
