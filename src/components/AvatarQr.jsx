import { useEffect, useState } from 'react';

// Same key AccessGate writes. The header also renders on the waitlist,
// where no code exists yet; the modal then shows just the QR.
function readInviteCode() {
  try {
    return localStorage.getItem('embeddr_invite') ?? '';
  } catch {
    return '';
  }
}

// The avatar is you: it wears the first letter of your invite code, and
// tapping it shows the full code plus the join QR on any viewport, no flag
// involved. The flag-gated corner QR stays presenter furniture; this one
// is for showing your own screen to a neighbor.
export default function AvatarQr() {
  const [open, setOpen] = useState(false);
  const code = readInviteCode();
  const initial = code ? code[0].toUpperCase() : 'U';

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show your invite code and the join QR"
        className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-rose to-lavender font-mono text-xs font-medium text-ink transition-transform active:scale-95 sm:h-9 sm:w-9"
      >
        {initial}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your invite code and the join QR"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-card-in rounded-2xl border border-line bg-surface-raised p-4"
            onClick={(event) => event.stopPropagation()}
          >
            {code && (
              <>
                <p className="font-mono text-xs text-muted">your invite code</p>
                <p className="mb-3 border-b border-line pb-3 font-mono text-lg break-all text-cream">
                  {code}
                </p>
              </>
            )}
            <p className="mb-2 font-mono text-xs text-lavender">
              scan to join <span className="text-rose">♥</span>
            </p>
            <img
              src="/qr.png"
              alt="QR code to open Embeddr on your phone"
              className="w-56 max-w-full rounded-lg"
            />
            <p className="mt-2 font-mono text-xs text-cream">
              or type <span className="text-peach">embeddr.getunleash.io</span>
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-muted">
              the embedding space has room for one more
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 min-h-11 w-full rounded-full border border-line font-mono text-xs text-muted transition-colors hover:border-muted hover:text-cream"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
