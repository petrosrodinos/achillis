import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';

export interface TooltipProps {
  content: ReactNode;
  /** A single focusable element (button, link…). Disabled buttons should be wrapped in a span with tabIndex=0. */
  children: ReactElement<Record<string, unknown>>;
  side?: 'top' | 'bottom';
  /** Delay before showing on hover, ms. Focus shows immediately. */
  delay?: number;
  className?: string;
}

/**
 * Parchment tooltip shown on hover and keyboard focus, hidden on Esc / blur.
 * Wires `aria-describedby` on the trigger. Rendered in a portal so frames never clip it.
 */
export function Tooltip({ content, children, side = 'top', delay = 250, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = (immediate: boolean) => {
    window.clearTimeout(timer.current);
    if (immediate) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: side === 'top' ? r.top : r.bottom });
  }, [open, side]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    const onScroll = () => hide();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      anchorRef.current = el;
    },
    'aria-describedby': open ? id : undefined,
    onMouseEnter: (e: unknown) => {
      show(false);
      (children.props.onMouseEnter as ((e: unknown) => void) | undefined)?.(e);
    },
    onMouseLeave: (e: unknown) => {
      hide();
      (children.props.onMouseLeave as ((e: unknown) => void) | undefined)?.(e);
    },
    onFocus: (e: unknown) => {
      show(true);
      (children.props.onFocus as ((e: unknown) => void) | undefined)?.(e);
    },
    onBlur: (e: unknown) => {
      hide();
      (children.props.onBlur as ((e: unknown) => void) | undefined)?.(e);
    },
  });

  return (
    <>
      {trigger}
      {open &&
        pos &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            style={{ left: pos.x, top: pos.y }}
            className={cn(
              'pointer-events-none fixed z-[120] max-w-xs -translate-x-1/2 animate-fade-in rounded-[3px] border-2 border-bronze-700 bg-parchment-100 px-3 py-1.5 text-center font-body text-[0.95rem] leading-snug text-ink shadow-[0_8px_20px_-6px_rgb(0_0_0/0.8)]',
              side === 'top' ? '-translate-y-[calc(100%+10px)]' : 'translate-y-[10px]',
              className,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
