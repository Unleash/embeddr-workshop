import AvatarQr from './AvatarQr.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-cream">
            embeddr
            <span className="text-rose">.</span>
          </span>
          <span className="hidden font-mono text-xs text-muted sm:inline">
            find your nearest neighbor
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AvatarQr />
        </div>
      </div>
    </header>
  );
}
