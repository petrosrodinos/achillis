import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** All keyboard-focusable, visible elements inside `root`, in DOM order. */
export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true' && el.getClientRects().length > 0,
  );
}

/** Keep Tab / Shift+Tab cycling within `root`. Call from a keydown handler. */
export function trapTab(e: KeyboardEvent | ReactKeyboardEvent, root: HTMLElement): void {
  if (e.key !== 'Tab') return;
  const items = getFocusable(root);
  if (items.length === 0) {
    e.preventDefault();
    root.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey && (active === first || !root.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !root.contains(active))) {
    e.preventDefault();
    first.focus();
  }
}
