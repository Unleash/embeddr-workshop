import Opener from './Opener.jsx';

export default function ProfileCard({ agent }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-rose/50 hover:shadow-[0_16px_40px_-16px_rgba(255,111,165,0.35)]">
      <div className="mb-5 flex items-start justify-between">
        <div
          aria-hidden="true"
          className="h-16 w-16 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${agent.orb[0]}, ${agent.orb[1]})`,
          }}
        />
        <span className="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-xs text-lavender">
          cos(θ) = {agent.compatibility.toFixed(2)} <span className="text-rose">♥</span>
        </span>
      </div>

      <h2 className="font-display text-2xl font-semibold text-cream">{agent.name}</h2>
      <p className="mb-3 font-mono text-xs text-muted">{agent.archetype}</p>
      <p className="mb-5 text-sm leading-relaxed text-cream/80">{agent.bio}</p>

      <dl className="mb-6 grid grid-cols-3 gap-2 font-mono text-xs">
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

      <p className="mb-5 text-xs text-muted">
        Love language: <span className="text-peach">{agent.loveLanguage}</span>
      </p>

      <Opener matchId={agent.id} />

      <div className="mt-auto flex gap-3">
        <button className="flex-1 rounded-full border border-line py-2 text-sm text-muted transition-colors hover:border-muted hover:text-cream">
          Pass
        </button>
        <button className="flex-1 rounded-full bg-rose py-2 text-sm font-medium text-ink transition-colors hover:bg-peach">
          Match
        </button>
      </div>
    </article>
  );
}
