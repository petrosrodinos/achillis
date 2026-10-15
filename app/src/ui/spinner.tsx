import { cn } from './cn';

export interface SpinnerProps {
  size?: number;
  className?: string;
  /** Accessible label; when omitted the spinner is decorative. */
  label?: string;
}

/** A rotating rondel (round shield boss) spinner. Becomes a soft pulse under reduced motion. */
export function Spinner({ size = 20, className, label }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-flex shrink-0', className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="animate-spin-slow"
      >
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
    </span>
  );
}
