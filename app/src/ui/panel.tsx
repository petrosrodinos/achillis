import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

export type FrameMetal = 'iron' | 'bronze' | 'oxblood';
export type PanelSurface = 'dark' | 'parchment';

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  /** Frame metal. Iron by default; bronze for primary/hero panels; oxblood for danger. */
  metal?: FrameMetal;
  /** Dark night surface or a parchment sheet (switches text to ink colours). */
  surface?: PanelSurface;
  /** Draw riveted corners. */
  rivets?: boolean;
  /** Inner padding preset. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: ElementType;
}

const pad = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' } as const;

/** Framed panel: metal border, riveted corners, dark or parchment surface. The building block of every screen. */
export function Panel({
  metal = 'iron',
  surface = 'dark',
  rivets = true,
  padding = 'md',
  as: Tag = 'section',
  className,
  ...rest
}: PanelProps) {
  return (
    <Tag
      className={cn(
        'wk-frame',
        metal !== 'iron' && `wk-frame--${metal}`,
        surface === 'parchment' && 'wk-frame--parchment wk-frame--textured',
        rivets && 'wk-rivets',
        pad[padding],
        className,
      )}
      {...rest}
    />
  );
}

export interface PanelHeaderProps {
  title: ReactNode;
  /** Small engraved label above the title. */
  eyebrow?: ReactNode;
  /** Right-aligned actions. */
  actions?: ReactNode;
  className?: string;
  /** Heading level for the title (defaults to h2). */
  level?: 1 | 2 | 3;
}

/** Title row for a Panel with an ornamental divider beneath. */
export function PanelHeader({ title, eyebrow, actions, className, level = 2 }: PanelHeaderProps) {
  const H = `h${level}` as 'h1' | 'h2' | 'h3';
  return (
    <header className={cn('mb-4', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="wk-engraved mb-1 text-xs text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">{eyebrow}</p>}
          <H className="wk-engraved text-xl text-accent-strong in-[.wk-frame--parchment]:text-oxblood-700 md:text-2xl">{title}</H>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <hr className="wk-divider mt-3" />
    </header>
  );
}

/** Thin ornamental separator. */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('wk-divider my-4', className)} />;
}
