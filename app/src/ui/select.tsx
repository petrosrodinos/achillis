import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from './cn';
import { FieldShell } from './field';
import { IconCheck, IconChevronDown } from './icons';
import { uiSound } from './hooks';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string> {
  label: ReactNode;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
  /** Minimum trigger width (CSS length). */
  minWidth?: string;
}

/**
 * Custom accessible select (button + listbox pattern).
 * Keyboard: ↑/↓/Home/End move, Enter/Space choose, Esc closes, Tab closes, type-ahead by first letters.
 * Closed trigger also supports ↑/↓ to open.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  error,
  disabled,
  hideLabel,
  className,
  minWidth = '12rem',
}: SelectProps<T>) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const selected = options.find((o) => o.value === value);

  const openList = () => {
    if (disabled) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
    uiSound('ui-click');
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const choose = (idx: number) => {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    if (opt.value !== value) onChange(opt.value);
    uiSound('ui-confirm');
    close();
  };

  const step = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const idx = (from + dir * i + options.length) % options.length;
      if (!options[idx].disabled) return idx;
    }
    return from;
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onListKey = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => step(a, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => step(a, -1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(step(-1, 1));
        break;
      case 'End':
        e.preventDefault();
        setActive(step(options.length, -1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case 'Tab':
        close(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = e.timeStamp;
          const t = typeahead.current;
          t.text = now - t.at > 700 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.at = now;
          const idx = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.text));
          if (idx >= 0) setActive(idx);
        }
    }
  };

  return (
    <FieldShell id={`${id}-trigger`} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className}>
      <div ref={rootRef} className="relative" style={{ minWidth: `min(${minWidth}, 100%)` }}>
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-invalid={error ? true : undefined}
          onClick={() => (open ? close() : openList())}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              openList();
            }
          }}
          className={cn(
            'wk-well flex min-h-11 w-full items-center justify-between gap-3 px-3.5 text-left font-body text-[1.08rem] text-parchment-50 transition-colors hover:border-bronze-600 disabled:cursor-not-allowed disabled:opacity-55 in-[.wk-frame--parchment]:text-ink',
            open && '!border-bronze-400',
            error && '!border-oxblood-400',
          )}
        >
          <span className="truncate">{selected?.label ?? '—'}</span>
          <IconChevronDown size={18} className={cn('shrink-0 text-accent transition-transform duration-200', open && 'rotate-180')} />
        </button>
        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-trigger`}
            aria-activedescendant={`${id}-opt-${active}`}
            onKeyDown={onListKey}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] max-h-72 animate-rise-in overflow-y-auto rounded-[4px] border-2 border-bronze-700 bg-night-800 py-1 shadow-[0_16px_32px_-8px_rgb(0_0_0/0.9)] outline-none"
          >
            {options.map((o, i) => {
              const isSel = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSel}
                  aria-disabled={o.disabled || undefined}
                  onMouseEnter={() => !o.disabled && setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-start gap-2 px-3 py-2.5 text-parchment-100',
                    i === active && 'bg-bronze-700/40 text-parchment-50',
                    o.disabled && 'cursor-not-allowed opacity-45',
                  )}
                >
                  <span className="mt-1 inline-flex w-4 shrink-0 text-accent-strong">{isSel && <IconCheck size={16} />}</span>
                  <span>
                    <span className="block leading-tight">{o.label}</span>
                    {o.description && <span className="block text-[0.88rem] text-fg-subtle">{o.description}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}
