import { useEffect, useState } from 'react';
import { cn } from './cn';
import { Spinner } from './spinner';

export const DEFAULT_TIPS = [
  'Your shield stops arrows and spears — but never magic or fireballs.',
  'Dodging grants a brief moment of invulnerability. You cannot dodge while blocking.',
  'A heavy blow can break your guard. Watch for the wind-up and dodge instead.',
  'In open-field battles, press Tab to pick a company and Q to send it to your cursor.',
  'Perfect blocks and flawless rounds earn bonus points.',
  'Finish faster than par time for a time bonus on the leaderboard.',
  'The Wizard cannot be hurt by steel. Survive until his mana runs dry.',
  'All key bindings can be changed in Settings.',
];

export interface LoadingScreenProps {
  /** 0..1 — shows a determinate bar; omit for indeterminate. */
  progress?: number;
  title?: string;
  /** Status line under the bar, e.g. "Forging armour…". */
  label?: string;
  /** Rotating hints. Pass [] to hide. */
  tips?: string[];
  /** Fill the viewport (default) or the parent. */
  fullscreen?: boolean;
  className?: string;
}

/** Styled loading screen with crest, optional progress bar and rotating tips. */
export function LoadingScreen({ progress, title = 'White Knight', label = 'Loading…', tips = DEFAULT_TIPS, fullscreen = true, className }: LoadingScreenProps) {
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * Math.max(1, tips.length)));
  useEffect(() => {
    if (tips.length < 2) return;
    const t = window.setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 6500);
    return () => window.clearInterval(t);
  }, [tips.length]);
  const pct = progress === undefined ? null : Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const tip = tips.length ? tips[tipIdx % tips.length] : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-8 px-6 text-center',
        fullscreen ? 'fixed inset-0 z-[80] bg-[radial-gradient(90%_70%_at_50%_40%,#2a2018_0%,#13100d_60%,#0b0908_100%)]' : 'min-h-[50vh] w-full',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <svg width="64" height="74" viewBox="0 0 40 46" aria-hidden="true" className="drop-shadow-[0_6px_10px_rgb(0_0_0/0.8)]">
          <path d="M20 1.5 37.5 6v14c0 12-8 20-17.5 24.5C10.5 40 2.5 32 2.5 20V6z" fill="#d5d8dc" stroke="#4a4e54" strokeWidth="1.5" />
          <path d="M20 5.5 34 9v11c0 9.6-6.3 16.2-14 20-7.7-3.8-14-10.4-14-20V9z" fill="#e8e4da" />
          <path d="M20 9v29M10 19h20" stroke="#c9a54a" strokeWidth="3.2" strokeLinecap="square" />
        </svg>
        <p className="wk-gilded text-3xl font-black md:text-4xl">{title}</p>
      </div>

      <div className="w-full max-w-md">
        <div className="relative h-4 overflow-hidden rounded-full border-2 border-[#0b0807] bg-[linear-gradient(180deg,#120e0b,#2a221b)] shadow-[0_0_0_2px_#4f3417,inset_0_2px_3px_rgb(0_0_0/0.8)]">
          {pct === null ? (
            <div className="wk-shimmer absolute inset-0 !bg-[length:50%_100%] [background-image:linear-gradient(90deg,transparent,#c9a54a,transparent)]" />
          ) : (
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%`, background: 'linear-gradient(180deg,#f6dc95 0%,#c9a54a 50%,#7a5a1e 100%)' }}
            />
          )}
        </div>
        <p className="mt-3 flex items-center justify-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.16em] text-fg-muted">
          {pct === null && <Spinner size={14} />}
          {label}
          {pct !== null && <span className="tabular-nums text-accent-strong">{pct}%</span>}
        </p>
      </div>

      {tip && (
        <p key={tipIdx} className="max-w-xl animate-fade-in text-lg italic leading-snug text-fg-muted">
          <span className="not-italic font-heading text-xs font-bold uppercase tracking-[0.16em] text-accent">Tip · </span>
          {tip}
        </p>
      )}
    </div>
  );
}
