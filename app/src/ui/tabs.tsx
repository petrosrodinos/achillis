import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { uiSound } from './hooks';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name for the tablist. */
  label: string;
  /** Prefix for tab/panel ids so TabPanel can be wired with `aria-labelledby`. */
  idBase: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Banner-style tabs following the WAI-ARIA tabs pattern: roving tabindex,
 * ←/→ (and ↑/↓) move + activate, Home/End jump. Pair with {@link TabPanel}.
 */
export function Tabs<T extends string>({ items, value, onChange, label, idBase, size = 'md', className }: TabsProps<T>) {
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const enabled = items.filter((i) => !i.disabled);

  const move = (delta: number | 'first' | 'last') => {
    const idx = enabled.findIndex((i) => i.id === value);
    let next: TabItem<T> | undefined;
    if (delta === 'first') next = enabled[0];
    else if (delta === 'last') next = enabled[enabled.length - 1];
    else next = enabled[(idx + delta + enabled.length) % enabled.length];
    if (!next) return;
    onChange(next.id);
    uiSound('ui-toggle');
    refs.current.get(next.id)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('inline-flex flex-wrap items-end gap-1 border-b-2 border-bronze-800/80', className)}
      onKeyDown={(e) => {
        const map: Record<string, number | 'first' | 'last'> = {
          ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: 'first', End: 'last',
        };
        const d = map[e.key];
        if (d !== undefined) {
          e.preventDefault();
          move(d);
        }
      }}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) refs.current.set(item.id, el);
              else refs.current.delete(item.id);
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => {
              if (!selected) uiSound('ui-toggle');
              onChange(item.id);
            }}
            onMouseEnter={() => !selected && !item.disabled && uiSound('ui-hover')}
            className={cn(
              'relative -mb-0.5 inline-flex items-center gap-2 rounded-t-[4px] border-2 border-b-0 font-heading font-bold uppercase tracking-[0.12em] transition-[color,background-color,transform] duration-150',
              size === 'sm' ? 'px-3 py-1.5 text-[0.75rem] pointer-coarse:min-h-11' : 'min-h-11 px-3 py-2.5 text-[0.8rem] sm:px-4 sm:text-[0.85rem]',
              selected
                ? 'border-bronze-600 bg-gradient-to-b from-night-600 to-night-800 text-accent-strong after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-night-800'
                : 'border-transparent text-fg-muted hover:bg-night-700/70 hover:text-parchment-100',
              'disabled:cursor-not-allowed disabled:opacity-45',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  idBase: string;
  tabId: string;
}

/** The panel associated with a tab from {@link Tabs}. Render only the active one. */
export function TabPanel({ idBase, tabId, className, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${tabId}`}
      aria-labelledby={`${idBase}-tab-${tabId}`}
      tabIndex={0}
      className={cn('outline-offset-4', className)}
      {...rest}
    />
  );
}
