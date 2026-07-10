import { agents } from '../data/agents.js';
import ProfileCard from './ProfileCard.jsx';

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
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent, i) => (
        <div key={agent.id} className={`animate-card-in ${entranceDelays[i % entranceDelays.length]}`}>
          <ProfileCard agent={agent} />
        </div>
      ))}
    </section>
  );
}
