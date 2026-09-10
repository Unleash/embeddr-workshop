import { reportMatch } from '../lib/api.js';
import Opener from './Opener.jsx';

// onPass and onMatch only advance the deck; in the grid they are undefined
// and the buttons stay in place. Every Match tap reports either way, so the
// layout experiment's success metric counts both universes.
export default function ProfileCard({ agent, onPass, onMatch }) {
  const handleMatch = () => {
    reportMatch();
    onMatch?.();
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-rose/50 hover:shadow-[0_16px_40px_-16px_rgba(255,111,165,0.35)] sm:p-6">
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
          onClick={onPass}
          className="min-h-11 flex-1 rounded-full border border-line text-sm text-muted transition-colors hover:border-muted hover:text-cream"
        >
          Pass
        </button>
        <button
          onClick={handleMatch}
          className="min-h-11 flex-1 rounded-full bg-rose text-sm font-medium text-ink transition-colors hover:bg-peach"
        >
          Match
        </button>
      </div>
    </article>
  );
}
