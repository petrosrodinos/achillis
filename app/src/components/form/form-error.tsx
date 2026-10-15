import type { ReactNode } from 'react';
import { IconWarning, cn } from '@/ui';

/** Form-level error banner (role=alert). Renders nothing without a message. */
export function FormError({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <div role="alert" className={cn('flex items-start gap-2 rounded-[3px] border-2 border-oxblood-600/70 bg-oxblood-600/10 px-3 py-2 text-[0.98rem] leading-snug text-danger-ink', className)}>
      <IconWarning size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Link style for parchment surfaces (AA contrast oxblood ink). */
export const inkLinkClass =
  'font-semibold text-oxblood-700 underline decoration-oxblood-700/40 underline-offset-2 transition-colors hover:decoration-oxblood-700';

/** Link style on dark surfaces. */
export const darkLinkClass =
  'font-semibold text-accent-strong underline decoration-bronze-400/40 underline-offset-2 transition-colors hover:text-parchment-50 hover:decoration-parchment-50';
