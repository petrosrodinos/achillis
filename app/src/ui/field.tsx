import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { IconEye, IconEyeOff, IconWarning } from './icons';

export interface FieldShellProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Visually hide the label (still announced). */
  hideLabel?: boolean;
}

/** Label + control + hint/error layout shared by all form controls. */
export function FieldShell({ id, label, hint, error, children, className, hideLabel }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'wk-engraved text-[0.78rem] font-bold text-fg-muted in-[.wk-frame--parchment]:text-ink-muted',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[0.95rem] leading-snug text-danger-fg in-[.wk-frame--parchment]:text-danger-ink">
          <IconWarning size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.92rem] leading-snug text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  /** Error message; sets aria-invalid and replaces the hint. */
  error?: ReactNode;
  hideLabel?: boolean;
  /** Element rendered inside the well on the right (e.g. a reveal button). */
  trailing?: ReactNode;
  containerClassName?: string;
}

/** Labelled text input in a sunken iron well, with hint and accessible error text. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, hint, error, hideLabel, trailing, id: idProp, className, containerClassName, 'aria-describedby': extraDescribedBy, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = [error ? `${id}-error` : hint ? `${id}-hint` : undefined, extraDescribedBy].filter(Boolean).join(' ') || undefined;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={containerClassName}>
      <div
        className={cn(
          'wk-well flex items-center transition-[border-color,box-shadow] duration-150 focus-within:border-bronze-400',
          error && '!border-oxblood-400',
        )}
      >
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'min-h-11 w-full min-w-0 bg-transparent px-3.5 font-body text-[1.08rem] text-parchment-50 placeholder:text-fg-subtle/80 focus:outline-none in-[.wk-frame--parchment]:text-ink in-[.wk-frame--parchment]:placeholder:text-ink-muted/70',
            className,
          )}
          {...rest}
        />
        {trailing}
      </div>
    </FieldShell>
  );
});

export type PasswordInputProps = Omit<TextInputProps, 'type' | 'trailing'>;

/** Password field with an accessible show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextInput
      ref={ref}
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          data-reveal
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="mr-1.5 rounded p-1.5 pointer-coarse:p-2.5 text-fg-subtle transition-colors hover:text-parchment-50 in-[.wk-frame--parchment]:text-ink-muted"
        >
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      }
    />
  );
});
