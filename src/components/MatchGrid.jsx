import { useEffect, useState } from 'react';
import { agents } from '../data/agents.js';
import { fetchLayout, fetchPremium } from '../lib/api.js';
import MatchDeck from './MatchDeck.jsx';
import PremiumUpsell from './PremiumUpsell.jsx';
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
  const [premium, setPremium] = useState(null);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const [nextPremium, nextLayout] = await Promise.all([fetchPremium(), fetchLayout()]);
      if (cancelled) return;
      // Keep the object stable across polls unless the upsell appeared or
      // went away, so the cards only re-render on an actual change.
      setPremium((prev) => (Boolean(prev) === Boolean(nextPremium) ? prev : nextPremium));
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
        {premium && (
          <div className="animate-card-in mx-auto mt-6 max-w-sm">
            <PremiumUpsell premium={premium} />
          </div>
        )}
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
      {premium && (
        <div className={`animate-card-in ${entranceDelays[agents.length % entranceDelays.length]}`}>
          <PremiumUpsell premium={premium} />
        </div>
      )}
    </section>
  );
}
