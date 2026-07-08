import { useEffect, useRef, useState } from 'react';
import { fetchOpener, reportIck } from '../lib/api.js';

// Poll a beat slower than the backend's 2s flag refresh, so a flag turned
// off in Unleash clears the composer within a few seconds without a reload.
const POLL_INTERVAL = 3000;
// How long the collapse transition gets before the DOM is cleaned up.
const EXIT_MS = 350;

function SendIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4Z" />
    </svg>
  );
}

function RerollIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15.74-6L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.74 6L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ThumbsDownIcon({ className, size = 16 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

// Fixed particle vectors: cheap, deterministic, transform-only.
const BURST_VECTORS = [
  '[--dx:-20px] [--dy:-44px]',
  '[--dx:-7px] [--dy:-54px] [animation-delay:40ms]',
  '[--dx:6px] [--dy:-48px] [animation-delay:20ms]',
  '[--dx:19px] [--dy:-40px] [animation-delay:60ms]',
  '[--dx:0px] [--dy:-32px] [animation-delay:80ms]',
];

export default function Opener({ matchId }) {
  const [displayLine, setDisplayLine] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [planeId, setPlaneId] = useState(null);

  const variantRef = useRef(0);
  const visibleRef = useRef(false);
  const timersRef = useRef(new Set());
  const idRef = useRef(0);

  const after = (ms, fn) => {
    const t = setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  };

  useEffect(() => {
    let cancelled = false;

    const apply = (line) => {
      if (cancelled) return;
      if (line) {
        setDisplayLine(line);
        setVisible(true);
        visibleRef.current = true;
      } else if (visibleRef.current) {
        // The kill: collapse gracefully, then reset every trace of the
        // composer, including particles mid-flight.
        setVisible(false);
        visibleRef.current = false;
        after(EXIT_MS, () => {
          setDisplayLine(null);
          setSent(false);
          setBursts([]);
          setPlaneId(null);
          variantRef.current = 0;
        });
      }
    };

    const poll = async () => apply(await fetchOpener(matchId, variantRef.current));
    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current.clear();
    };
  }, [matchId]);

  if (!displayLine && !visible) {
    return <div aria-hidden="true" className="grid grid-rows-[0fr]" />;
  }

  const handleSend = () => {
    if (sent || planeId !== null) return;
    setPlaneId((idRef.current += 1));
    after(400, () => setSent(true));
    after(800, () => setPlaneId(null));
  };

  const handleReroll = async () => {
    variantRef.current += 1;
    const line = await fetchOpener(matchId, variantRef.current);
    if (line) setDisplayLine(line);
    else {
      setVisible(false);
      visibleRef.current = false;
      after(EXIT_MS, () => setDisplayLine(null));
    }
  };

  const handleIck = () => {
    reportIck();
    const id = (idRef.current += 1);
    setBursts((b) => [...b, id]);
    after(700, () => setBursts((b) => b.filter((x) => x !== id)));
  };

  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${visible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="min-h-0 overflow-hidden">
        <div className="mb-5 rounded-xl border border-line/60 bg-surface-raised p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs text-lavender">auto-rizz suggests</p>
            <button
              type="button"
              onClick={handleIck}
              aria-label="Ick"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-rose/40 text-rose transition-colors active:bg-rose/10"
            >
              <ThumbsDownIcon />
              {bursts.map((id) => (
                <span key={id} aria-hidden="true" className="pointer-events-none absolute inset-0">
                  {BURST_VECTORS.map((vec) => (
                    <span key={vec} className={`animate-burst absolute top-1/2 left-1/2 -ml-1.5 -mt-1.5 text-rose ${vec}`}>
                      <ThumbsDownIcon size={12} />
                    </span>
                  ))}
                </span>
              ))}
            </button>
          </div>

          <p key={displayLine} className={`animate-line-in mt-1 text-sm italic leading-relaxed ${sent ? 'text-cream/50' : 'text-cream/90'}`}>
            {displayLine}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {sent ? (
              <p className="animate-line-in flex min-h-11 items-center font-mono text-xs text-peach">
                Sent. No take-backs.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSend}
                  className="relative flex min-h-11 items-center gap-2 rounded-full bg-rose px-4 text-sm font-medium text-ink transition-[background-color,transform] active:scale-95"
                >
                  <SendIcon />
                  Send
                  {planeId !== null && (
                    <span aria-hidden="true" className="animate-plane pointer-events-none absolute -top-1 right-2 text-rose">
                      <SendIcon />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReroll}
                  aria-label="Reroll opener"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-lavender/40 text-lavender transition-colors active:bg-lavender/10"
                >
                  <RerollIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
