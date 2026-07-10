import { useEffect, useRef, useState } from 'react';
import { fetchQrCode } from '../lib/api.js';

// Same rhythm as the opener: poll so the corner appears and disappears
// within a few seconds of the flag flipping, no reload.
const POLL_INTERVAL = 3000;
const EXIT_MS = 350;

// Presenter-screen furniture: the QR invites the room in, so it only
// renders on viewports big enough to be a projector, not on the phones
// that just scanned it.
export default function QrCorner() {
  const [src, setSrc] = useState(null);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const exitTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const qr = await fetchQrCode();
      if (cancelled) return;
      if (qr) {
        clearTimeout(exitTimer.current);
        setSrc(qr);
        setVisible(true);
        visibleRef.current = true;
      } else if (visibleRef.current) {
        setVisible(false);
        visibleRef.current = false;
        exitTimer.current = setTimeout(() => setSrc(null), EXIT_MS);
      }
    };
    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(exitTimer.current);
    };
  }, []);

  if (!src) return null;

  return (
    <div
      className={`animate-qr-in fixed right-6 bottom-6 z-50 hidden transition-[opacity,transform] duration-300 ease-out sm:block ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
    >
      <div className="animate-qr-float">
        <div className="relative -rotate-2 transition-transform duration-300 hover:rotate-0">
          <span
            aria-hidden="true"
            className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff6fa5,#b7a6f0)] opacity-70 blur-md"
          />
          <span
            aria-hidden="true"
            className="absolute -right-3 -bottom-3 h-10 w-10 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffb088,#ff6fa5)] opacity-60 blur-md"
          />
          <div className="relative rounded-2xl border border-line bg-surface-raised p-3 shadow-[0_20px_56px_-16px_rgba(255,111,165,0.45)]">
            <p className="mb-2 font-mono text-xs text-lavender">
              scan to join <span className="text-rose">♥</span>
            </p>
            <img src={src} alt="QR code to open Embeddr on your phone" className="w-44 rounded-lg" />
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted">
              the embedding space has room for one more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
