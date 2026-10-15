import { cn } from './cn';

export interface RotateDeviceNoticeProps {
  /** Render as a fixed full-screen overlay (default) or inline. */
  overlay?: boolean;
  className?: string;
}

/**
 * "Rotate your device to landscape" notice for the play page when `useDeviceSupport().rotate` is true.
 * The animated phone respects reduced motion (global rule).
 */
export function RotateDeviceNotice({ overlay = true, className }: RotateDeviceNoticeProps) {
  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="Rotate your device to landscape"
      className={cn(
        'flex flex-col items-center justify-center gap-6 px-8 text-center',
        overlay && 'fixed inset-0 z-[140] bg-[radial-gradient(90%_70%_at_50%_40%,#2a2018_0%,#13100d_60%,#0b0908_100%)]',
        className,
      )}
    >
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true" className="text-accent-strong">
        <g className="origin-center animate-[wk-rotate-hint_2.4s_var(--ease-weighty)_infinite]" style={{ transformBox: 'fill-box' }}>
          <rect x="30" y="14" width="36" height="68" rx="6" fill="#1c1712" stroke="currentColor" strokeWidth="3" />
          <rect x="35" y="22" width="26" height="48" rx="2" fill="currentColor" fillOpacity="0.15" />
          <circle cx="48" cy="76" r="2.5" fill="currentColor" />
        </g>
        <path d="M14 40a34 34 0 0 1 20-24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m30 12 5 4-4 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <p className="wk-engraved text-xl text-parchment-50">Turn your shield sideways</p>
        <p className="mt-2 max-w-xs text-lg text-fg-muted">Rotate your device to landscape to take the field.</p>
      </div>
    </div>
  );
}
