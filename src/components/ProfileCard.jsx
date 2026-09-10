import { useEffect, useRef, useState } from 'react';
import { reportMatch } from '../lib/api.js';
import Opener from './Opener.jsx';

// Fixed particle vectors for the match burst, same trick as the opener's
// ick burst: cheap, deterministic, transform-only.
const HEART_VECTORS = [
  '[--dx:-22px] [--dy:-40px]',
  '[--dx:-8px] [--dy:-52px] [animation-delay:40ms]',
  '[--dx:6px] [--dy:-46px] [animation-delay:20ms]',
  '[--dx:20px] [--dy:-38px] [animation-delay:60ms]',
  '[--dx:0px] [--dy:-30px] [animation-delay:80ms]',
];

// onPass and onMatch only advance the deck; in the grid they are undefined
// and the card keeps its own passed/matched state so the buttons visibly do
// something. Every first Match tap reports either way, so the layout
// experiment's success metric counts both universes.
export default function ProfileCard({ agent, onPass, onMatch }) {
  const [status, setStatus] = useState('idle');
  const [burstId, setBurstId] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const passed = !onPass && status === 'passed';
  const matched = !onMatch && status === 'matched';

  const handlePass = () => {
    if (onPass) return onPass();
    setStatus((current) => (current === 'passed' ? 'idle' : 'passed'));
  };

  const handleMatch = () => {
    if (matched) return;
    reportMatch();
    if (onMatch) return onMatch();
    setStatus('matched');
    setBurstId((id) => (id ?? 0) + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBurstId(null), 700);
  };

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-surface p-5 transition-[transform,box-shadow,border-color,opacity,filter] duration-300 ease-out hover:-translate-y-1.5 sm:p-6 ${
        matched
          ? 'border-rose/70 shadow-[0_16px_40px_-16px_rgba(255,111,165,0.45)]'
          : 'border-line hover:border-rose/50 hover:shadow-[0_16px_40px_-16px_rgba(255,111,165,0.35)]'
      } ${passed ? 'opacity-50 saturate-50' : ''}`}
    >
      <div className="mb-4 flex items-start justify-between sm:mb-5">
        <div
          aria-hidden="true"
          className="h-12 w-12 rounded-full sm:h-16 sm:w-16"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${agent.orb[0]}, ${agent.orb[1]})`,
          }}
        />
        <span className="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-xs text-lavender">
          cos(θ) = {agent.compatibility.toFixed(2)} <span className="text-rose">♥</span>
        </span>
      </div>

      <h2 className="font-display text-xl font-semibold text-cream sm:text-2xl">{agent.name}</h2>
      <p className="mb-2 font-mono text-xs text-muted sm:mb-3">{agent.archetype}</p>
      <p className="mb-4 text-sm leading-relaxed text-cream/80 sm:mb-5">{agent.bio}</p>

      <dl className="mb-4 grid grid-cols-3 gap-2 font-mono text-xs sm:mb-6">
        <div className="rounded-lg bg-surface-raised p-2">
          <dt className="text-muted">params</dt>
          <dd className="text-cream">{agent.params}</dd>
        </div>
        <div className="rounded-lg bg-surface-raised p-2">
          <dt className="text-muted">context</dt>
          <dd className="text-cream">{agent.contextWindow}</dd>
        </div>
        <div className="rounded-lg bg-surface-raised p-2">
          <dt className="text-muted">temp</dt>
          <dd className="text-cream">{agent.temperature}</dd>
        </div>
      </dl>

      <p className="mb-4 text-xs text-muted sm:mb-5">
        Love language: <span className="text-peach">{agent.loveLanguage}</span>
      </p>

      <Opener matchId={agent.id} />

      <div className="mt-auto flex gap-3">
        <button
          onClick={handlePass}
          className={`min-h-11 flex-1 rounded-full border text-sm transition-colors ${
            passed
              ? 'border-muted text-cream'
              : 'border-line text-muted hover:border-muted hover:text-cream'
          }`}
        >
          {passed ? 'Passed' : 'Pass'}
        </button>
        <button
          onClick={handleMatch}
          disabled={matched}
          className={`relative min-h-11 flex-1 rounded-full text-sm font-medium text-ink transition-colors ${
            matched ? 'bg-peach' : 'bg-rose hover:bg-peach'
          }`}
        >
          {matched ? 'Matched ♥' : 'Match'}
          {burstId !== null && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              {HEART_VECTORS.map((vec) => (
                <span
                  key={vec}
                  className={`animate-burst absolute top-1/2 left-1/2 -mt-2 -ml-2 text-sm text-rose ${vec}`}
                >
                  ♥
                </span>
              ))}
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
