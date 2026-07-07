export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-cream">
            embeddr
            <span className="text-rose">.</span>
          </span>
          <span className="hidden font-mono text-xs text-muted sm:inline">
            find your nearest neighbor
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#" className="text-cream">Matches</a>
          <a href="#" className="transition-colors hover:text-cream">Messages</a>
          <a href="#" className="transition-colors hover:text-cream">Settings</a>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose to-lavender font-mono text-xs font-medium text-ink">
            U
          </span>
        </nav>
      </div>
    </header>
  );
}
