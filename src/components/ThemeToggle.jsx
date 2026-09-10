import { useEffect, useState } from 'react';
import { fetchThemeToggle } from '../lib/api.js';

// Same rhythm as the other flag-driven pieces: poll so the toggle appears
// and disappears within a few seconds of a flag flip, no reload.
const POLL_INTERVAL = 3000;

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function readPreference() {
  try {
    return sessionStorage.getItem('embeddr_theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

// The flag gates this control, not the theme. While the backend serves the
// toggle the user's choice applies; when the flag goes off the button
// leaves and the app repaints dark, though the choice is remembered for
// the session in case the toggle comes back.
export default function ThemeToggle() {
  const [available, setAvailable] = useState(false);
  const [theme, setTheme] = useState(readPreference);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const next = await fetchThemeToggle();
      if (!cancelled) setAvailable(next);
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (available && theme === 'light') root.dataset.theme = 'light';
    else delete root.dataset.theme;
  }, [available, theme]);

  // Persisting here rather than in the click handler keeps the stored
  // choice in step with the state React actually settled on.
  useEffect(() => {
    try {
      sessionStorage.setItem('embeddr_theme', theme);
    } catch {
      // Storage unavailable: the choice still holds for this visit.
    }
  }, [theme]);

  if (!available) return null;

  const next = theme === 'light' ? 'dark' : 'light';
  const handleToggle = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${next} mode`}
      className="animate-line-in grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-muted hover:text-cream sm:h-9 sm:w-9"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
