import { useState } from 'react';
import ProfileCard from './ProfileCard.jsx';

// The deck half of the match-layout-experiment: one profile at a
// time, pass or match to advance. The stacked card backs peek out only
// while more profiles remain, so the deck visibly runs down.
export default function MatchDeck({ agents }) {
  const [index, setIndex] = useState(0);
  const remaining = agents.length - index;
  const advance = () => setIndex((i) => i + 1);

  if (remaining <= 0) {
    return (
      <div className="mx-auto max-w-sm">
        <div className="animate-card-in rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
          <p className="mb-2 font-display text-2xl font-semibold text-cream">That was everyone</p>
          <p className="mb-6 text-sm leading-relaxed text-muted">
            You have reached the edge of latent space. The embeddings need a
            moment to recover.
          </p>
          <button
            onClick={() => setIndex(0)}
            className="min-h-11 rounded-full bg-rose px-6 text-sm font-medium text-ink transition-colors hover:bg-peach"
          >
            Shuffle and go again
          </button>
        </div>
      </div>
    );
  }

  const agent = agents[index];

  return (
    <div className="mx-auto max-w-sm">
      <div className="relative">
        {remaining > 2 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-y-3 rotate-2 rounded-2xl border border-line bg-surface-raised/60"
          />
        )}
        {remaining > 1 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-y-1.5 -rotate-1 rounded-2xl border border-line bg-surface-raised/80"
          />
        )}
        <div key={agent.id} className="animate-card-in relative">
          <ProfileCard agent={agent} onPass={advance} onMatch={advance} />
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-xs text-muted">
        {index + 1} of {agents.length} in your neighborhood
      </p>
    </div>
  );
}
