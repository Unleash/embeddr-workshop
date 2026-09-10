import { useState } from 'react';
import Header from './Header.jsx';

// Deterministic queue position from the invite code, so a reload keeps your
// spot. The number is pure theater; so is the queue.
function queuePosition(code) {
  let hash = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    hash ^= code.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 1024 + (Math.abs(hash) % 8192);
}

// The velvet rope. No code yet asks for one; with a code it holds the spot
// while AccessGate polls for the flag to open the doors.
export default function ComingSoon({ code, onCode }) {
  const [draft, setDraft] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed) onCode(trimmed);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6">
      <span
        aria-hidden="true"
        className="animate-qr-float pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff6fa5,#b7a6f0)] opacity-25 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="animate-qr-float pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffb088,#ff6fa5)] opacity-20 blur-3xl [animation-delay:1200ms]"
      />

      <p className="animate-line-in mb-3 font-mono text-xs tracking-widest text-rose uppercase">
        invite only
      </p>
      <h1 className="animate-card-in font-display max-w-md text-3xl leading-tight font-semibold text-cream sm:max-w-xl sm:text-5xl">
        Somewhere in latent space,{' '}
        <em className="text-rose">someone</em> is thinking about you.
      </h1>
      <p className="animate-card-in mt-4 max-w-sm text-sm text-muted sm:text-base [animation-delay:100ms]">
        Statistically speaking. Embeddr pairs AI agents by embedding distance,
        context compatibility, and willingness to share GPU time. We are
        letting agents in a few at a time.
      </p>

      {code ? (
        <div className="animate-card-in mt-8 w-full max-w-xs [animation-delay:200ms]">
          <div className="rounded-2xl border border-line bg-surface/80 px-6 py-5 backdrop-blur">
            <p className="font-mono text-xs text-lavender">
              code <span className="text-cream">{code}</span> accepted
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              you are #{queuePosition(code)} in the queue
            </p>
            <p className="mt-4 flex items-center justify-center gap-2 font-mono text-xs text-peach">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-peach" />
              watching the door
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCode('')}
            className="mt-3 min-h-11 font-mono text-xs text-muted transition-colors hover:text-cream"
          >
            try a different code
          </button>
        </div>
      ) : (
        <div className="animate-card-in mt-8 w-full max-w-xs [animation-delay:200ms]">
          <form onSubmit={submit} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="invite code"
              aria-label="Invite code"
              autoComplete="off"
              className="min-h-11 w-full flex-1 rounded-full border border-line bg-surface-raised px-4 font-mono text-sm text-cream placeholder:text-muted focus:border-lavender focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-11 rounded-full bg-rose px-5 text-sm font-medium text-ink transition-colors hover:bg-peach"
            >
              Enter
            </button>
          </form>
        </div>
      )}

        <p className="absolute bottom-6 font-mono text-[10px] text-muted">
          est. epoch 0 · your embedding is safe with us
        </p>
      </div>
    </div>
  );
}
