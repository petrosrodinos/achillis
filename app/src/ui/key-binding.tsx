import { useEffect, useRef, useState } from 'react';
import { formatKeyCode, RESERVED_CODES } from '@/core/settings/settings-store';
import { cn } from './cn';
import { uiSound } from './hooks';

export interface KeyCapProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md';
}

/** A single engraved key cap, e.g. [W] or [LMB]. */
export function KeyCap({ code, className, size = 'md' }: KeyCapProps) {
  const isMouse = code.startsWith('Mouse');
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-[4px] border-2 border-[#0d0d0e] font-heading font-bold leading-none text-parchment-50 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_2px_0_#050404]',
        'bg-[linear-gradient(180deg,#5a5e64,#34373b_60%,#26282b)]',
        isMouse && 'bg-[linear-gradient(180deg,#8a6a3a,#5a3e1d_60%,#3a2812)]',
        size === 'sm' ? 'h-6 min-w-6 px-1.5 text-[0.7rem]' : 'h-8 min-w-8 px-2 text-[0.8rem]',
        className,
      )}
    >
      {formatKeyCode(code)}
    </kbd>
  );
}

export interface KeyBindingDisplayProps {
  codes: readonly string[];
  size?: 'sm' | 'md';
  className?: string;
  /** Text shown when nothing is bound. */
  emptyLabel?: string;
}

/** Shows every code bound to an action as key caps separated by "or". */
export function KeyBindingDisplay({ codes, size = 'md', className, emptyLabel = 'Unbound' }: KeyBindingDisplayProps) {
  if (codes.length === 0) return <span className={cn('italic text-fg-subtle', className)}>{emptyLabel}</span>;
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-1.5', className)}>
      {codes.map((c, i) => (
        <span key={c} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-[0.85rem] italic text-fg-subtle">or</span>}
          <KeyCap code={c} size={size} />
        </span>
      ))}
    </span>
  );
}

export interface KeyCaptureButtonProps {
  /** Currently bound codes (shown when idle). */
  codes: readonly string[];
  /** Called with a KeyboardEvent.code or 'Mouse0' | 'Mouse1' | 'Mouse2'. */
  onCapture: (code: string) => void;
  /** Accessible action name, e.g. "Light attack". */
  actionLabel: string;
  /** Codes that may never be bound; defaults to RESERVED_CODES (Escape, F5, F11, F12). */
  reserved?: readonly string[];
  /** Called when a reserved key is pressed (for a toast). */
  onReject?: (code: string) => void;
  className?: string;
}

/**
 * Click (or Enter) to listen; the next key or mouse button press is captured.
 * Esc cancels, reserved codes are rejected, focus loss cancels.
 */
export function KeyCaptureButton({
  codes,
  onCapture,
  actionLabel,
  reserved = RESERVED_CODES,
  onReject,
  className,
}: KeyCaptureButtonProps) {
  const [listening, setListening] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!listening) return;
    let armed = false;
    // Arm on the next frame so the click that started capture is not itself captured.
    const raf = requestAnimationFrame(() => (armed = true));

    const finish = (code: string | null) => {
      setListening(false);
      if (code) {
        onCapture(code);
        uiSound('ui-confirm');
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!armed) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === 'Escape') {
        uiSound('ui-back');
        finish(null);
        return;
      }
      if (reserved.includes(e.code) || !e.code) {
        setRejected(e.code || e.key);
        uiSound('ui-error');
        onReject?.(e.code || e.key);
        return;
      }
      finish(e.code);
    };
    const onMouse = (e: MouseEvent) => {
      if (!armed) return;
      // Mouse buttons are captured when pressed over the capture button; a click elsewhere cancels.
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        finish(null);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (e.button >= 0 && e.button <= 2) finish(`Mouse${e.button}`);
    };
    const onContext = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('mousedown', onMouse, true);
    window.addEventListener('contextmenu', onContext, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('mousedown', onMouse, true);
      // Let the trailing contextmenu (after a right-click bind) be swallowed too.
      setTimeout(() => window.removeEventListener('contextmenu', onContext, true), 0);
    };
  }, [listening, onCapture, onReject, reserved]);

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label={listening ? `Press a key or mouse button for ${actionLabel}. Escape cancels.` : `Rebind ${actionLabel}`}
      aria-live="polite"
      onClick={() => {
        if (!listening) {
          setRejected(null);
          setListening(true);
          uiSound('ui-click');
        }
      }}
      onBlur={() => setListening(false)}
      className={cn(
        'wk-well group inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 px-2 transition-colors hover:border-bronze-500 sm:w-44 sm:px-3',
        listening && 'animate-pulse-soft !border-ember/80',
        className,
      )}
    >
      {listening ? (
        rejected ? (
          <span className="text-[0.92rem] text-danger-fg">{formatKeyCode(rejected)} is reserved — try another</span>
        ) : (
          <span className="font-heading text-[0.8rem] font-bold uppercase tracking-[0.12em] text-ember-soft">Press a key…</span>
        )
      ) : (
        <KeyBindingDisplay codes={codes} size="sm" />
      )}
    </button>
  );
}
