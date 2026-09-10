import { useEffect, useRef, useState } from 'react';

// How long the fake payment provider pretends to think before failing.
const PROVIDER_TIMEOUT_MS = 900;

// The upsell rides in the match grid as a seventh tile, sized like a card
// so the grid keeps its rhythm when the flag turns it on. The Upgrade
// button fails on purpose: the payment provider behind it is down, which
// is the incident the presenter resolves by turning the flag off.
export default function PremiumUpsell({ premium }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleUpgrade = () => {
    if (status === 'pending') return;
    setStatus('pending');
    timer.current = setTimeout(() => setStatus('failed'), PROVIDER_TIMEOUT_MS);
  };

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-rose/40 bg-surface p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-rose/70 hover:shadow-[0_16px_40px_-16px_rgba(255,111,165,0.35)] sm:p-6">
      <span
        aria-hidden="true"
        className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff6fa5,#b7a6f0)] opacity-30 blur-2xl"
      />

      <p className="relative mb-4 font-mono text-xs tracking-widest text-lavender uppercase">
        {premium.eyebrow} <span className="text-rose">♥</span>
      </p>

      <h2 className="relative mb-3 font-display text-2xl font-semibold text-cream">
        {premium.headline}
      </h2>

      <p className="relative mb-6 text-sm leading-relaxed text-cream/80">{premium.body}</p>

      {status === 'failed' && (
        <p
          role="alert"
          className="animate-line-in relative mb-3 rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-xs text-rose"
        >
          payment provider not responding · 502
          <span className="mt-1 block text-muted">you have not been charged. probably.</span>
        </p>
      )}

      <button
        onClick={handleUpgrade}
        disabled={status === 'pending'}
        className="relative mt-auto min-h-11 w-full rounded-full bg-rose text-sm font-medium text-ink transition-colors hover:bg-peach disabled:animate-pulse disabled:cursor-wait disabled:hover:bg-rose"
      >
        {status === 'pending' && 'Contacting payment provider...'}
        {status === 'failed' && 'Try again'}
        {status === 'idle' && premium.cta}
      </button>
    </article>
  );
}
