import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { cn } from './cn';
import { IconCheck, IconClose, IconInfo, IconWarning } from './icons';
import { uiSound } from './hooks';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  /** ms before auto-dismiss; 0 keeps it until dismissed. */
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => number;
  dismiss: (id: number) => void;
  clear: () => void;
}

let nextId = 1;
const MAX_TOASTS = 4;

/** Toast queue (zustand). Prefer the `toast` helpers below. */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = nextId++;
    set((s) => {
      // Collapse exact duplicates (e.g. the same network error twice).
      const others = s.toasts.filter((x) => !(x.title === t.title && x.description === t.description));
      return { toasts: [...others, { ...t, id }].slice(-MAX_TOASTS) };
    });
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

interface ToastOptions {
  description?: string;
  duration?: number;
}

function make(kind: ToastKind, defaultDuration: number) {
  return (title: string, opts: ToastOptions = {}) => {
    if (kind === 'error') uiSound('ui-error');
    return useToastStore.getState().push({ kind, title, description: opts.description, duration: opts.duration ?? defaultDuration });
  };
}

/** Imperative toasts: `toast.success('Saved')`, `toast.error('Failed', { description })`. Usable outside React. */
export const toast = {
  success: make('success', 4000),
  error: make('error', 6500),
  info: make('info', 4500),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
};

const kindStyle: Record<ToastKind, { icon: ReactNode; cls: string }> = {
  success: { icon: <IconCheck size={18} />, cls: 'wk-frame--bronze [--toast-accent:#a9cb8f]' },
  error: { icon: <IconWarning size={18} />, cls: 'wk-frame--oxblood [--toast-accent:#ec9686]' },
  info: { icon: <IconInfo size={18} />, cls: '[--toast-accent:#dbb784]' },
};

function ToastView({ t }: { t: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  useEffect(() => {
    if (!t.duration) return;
    const timer = window.setTimeout(() => dismiss(t.id), t.duration);
    return () => window.clearTimeout(timer);
  }, [t.id, t.duration, dismiss]);
  const k = kindStyle[t.kind];
  return (
    <li
      role={t.kind === 'error' ? 'alert' : 'status'}
      className={cn('wk-frame pointer-events-auto flex w-[22rem] max-w-[calc(100vw-2rem)] animate-rise-in items-start gap-3 !p-3.5 pr-2', k.cls)}
    >
      <span className="mt-0.5 shrink-0 text-[var(--toast-accent)]">{k.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[0.92rem] font-bold leading-tight tracking-wide text-parchment-50">{t.title}</p>
        {t.description && <p className="mt-0.5 text-[0.95rem] leading-snug text-fg-muted">{t.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss notification"
        className="relative z-[2] shrink-0 rounded p-1 pointer-coarse:p-2.5 text-fg-subtle transition-colors hover:text-parchment-50"
      >
        <IconClose size={16} />
      </button>
    </li>
  );
}

/** Mount once at the app root. Bottom-right stack, polite live region. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <ol aria-live="polite" aria-label="Notifications" className="pointer-events-none fixed inset-x-4 bottom-4 z-[150] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((t) => (
        <ToastView key={t.id} t={t} />
      ))}
    </ol>,
    document.body,
  );
}
