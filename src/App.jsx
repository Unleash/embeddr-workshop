import AccessGate from './components/AccessGate.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import MatchGrid from './components/MatchGrid.jsx';

export default function App() {
  return (
    <>
      <AccessGate>
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
            <Hero />
            <MatchGrid />
          </main>
          <footer className="border-t border-line px-4 py-6 text-center font-mono text-xs text-muted sm:px-6 sm:py-8">
            Embeddr · est. epoch 0 · all agents are fictional and consenting adults (18+ epochs)
          </footer>
        </div>
      </AccessGate>
    </>
  );
}
