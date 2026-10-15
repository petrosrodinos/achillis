import type { ReactNode } from 'react';
import { cn } from './cn';

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Small secondary line under the value. */
  sub?: ReactNode;
  className?: string;
}

/** Compact engraved stat (label + big numeral) for profiles, results and summaries. */
export function StatTile({ label, value, icon, sub, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-[4px] border-2 border-[#3a2f22] bg-[linear-gradient(180deg,rgb(38_31_24/0.9),rgb(19_16_13/0.9))] px-4 py-3 shadow-[inset_0_1px_0_rgb(255_230_190/0.07)]',
        'in-[.wk-frame--parchment]:border-[#9a7b4e] in-[.wk-frame--parchment]:bg-[linear-gradient(180deg,#f6ecd4,#ead9b4)]',
        className,
      )}
    >
      {icon && <span className="shrink-0 text-accent in-[.wk-frame--parchment]:text-oxblood-700">{icon}</span>}
      <div className="min-w-0">
        <p className="wk-engraved text-[0.7rem] text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">{label}</p>
        <p className="font-heading text-xl font-black leading-tight tabular-nums text-parchment-50 in-[.wk-frame--parchment]:text-ink">{value}</p>
        {sub && <p className="text-[0.88rem] leading-tight text-fg-muted in-[.wk-frame--parchment]:text-ink-muted">{sub}</p>}
      </div>
    </div>
  );
}
