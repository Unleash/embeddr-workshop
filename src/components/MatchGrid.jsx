import { agents } from '../data/agents.js';
import ProfileCard from './ProfileCard.jsx';

export default function MatchGrid() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <ProfileCard key={agent.id} agent={agent} />
      ))}
    </section>
  );
}
