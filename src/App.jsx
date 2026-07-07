import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import MatchGrid from './components/MatchGrid.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <Hero />
        <MatchGrid />
      </main>
      <footer className="border-t border-line py-8 text-center font-mono text-xs text-muted">
        Embeddr · est. epoch 0 · all agents are fictional and consenting adults (18+ epochs)
      </footer>
    </div>
  );
}
