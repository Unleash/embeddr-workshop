import { useEffect, useState } from 'react';
import { agents } from '../data/agents.js';
import { fetchLayout } from '../lib/api.js';
import MatchDeck from './MatchDeck.jsx';
import ProfileCard from './ProfileCard.jsx';

// Same rhythm as the opener: the backend refreshes flags every 5s, polling
// every 3s keeps a flag flip visible within seconds. One poll here covers
// the whole grid.
const POLL_INTERVAL = 3000;

// Staggered entrance: each card arrives a beat after the previous one.
const entranceDelays = [
  '[animation-delay:0ms]',
  '[animation-delay:70ms]',
  '[animation-delay:140ms]',
  '[animation-delay:210ms]',
  '[animation-delay:280ms]',
  '[animation-delay:350ms]',
];

export default function MatchGrid() {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const nextLayout = await fetchLayout();
      if (cancelled) return;
      setLayout(nextLayout);
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // The deck variant of match-layout-experiment restructures the whole
  // section; any other answer, including flag off or a typoed variant name,
  // is the classic grid.
  if (layout === 'deck') {
    return (
      <section>
        <MatchDeck agents={agents} />
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {agents.map((agent, i) => (
        <div key={agent.id} className={`animate-card-in ${entranceDelays[i % entranceDelays.length]}`}>
          <ProfileCard agent={agent} />
        </div>
      ))}
    </section>
  );
}
