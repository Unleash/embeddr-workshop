import { useEffect, useState } from 'react';
import { fetchOpener, reportIck } from '../lib/api.js';

// Poll a beat slower than the backend's 2s flag refresh, so a flag turned
// off in Unleash clears the lines within a few seconds without a reload.
const POLL_INTERVAL = 3000;

export default function Opener({ matchId }) {
  const [line, setLine] = useState(null);
  const [icked, setIcked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      const opener = await fetchOpener(matchId);
      if (!cancelled) setLine(opener);
    }
    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [matchId]);

  if (!line) return null;

  const handleIck = () => {
    setIcked(true);
    reportIck();
  };

  return (
    <div className="mb-5 rounded-lg bg-surface-raised p-3">
      <p className="mb-1 font-mono text-xs text-lavender">auto-rizz suggests</p>
      <p className="text-sm italic leading-relaxed text-cream/90">{line}</p>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleIck}
          disabled={icked}
          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-rose hover:text-rose disabled:pointer-events-none disabled:border-rose/40 disabled:text-rose/60"
        >
          {icked ? 'icked' : 'ick'}
        </button>
      </div>
    </div>
  );
}
