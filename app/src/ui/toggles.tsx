import { useId, type ReactNode } from 'react';
import { cn } from './cn';
import { IconCheck } from './icons';
import { uiSound } from './hooks';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/** Iron-boxed checkbox with a bronze check mark. Native input underneath for full a11y. */
export function Checkbox({ checked, onChange, label, description, disabled, className, id: idProp }: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className={cn('flex items-start gap-3', disabled && 'opacity-55', className)}>
      <span className="relative mt-0.5 inline-flex size-6 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-describedby={description ? `${id}-desc` : undefined}
          onChange={(e) => {
            uiSound('ui-toggle');
            onChange(e.target.checked);
          }}
          className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-[3px] disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          className="wk-well pointer-events-none flex size-full items-center justify-center !rounded-[3px] text-accent-strong transition-colors peer-checked:border-bronze-500 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)] in-[.wk-frame--parchment]:text-oxblood-700"
        >
          {checked && <IconCheck size={18} />}
        </span>
      </span>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-[1.05rem] leading-tight">{label}</span>
        {description && (
          <span id={`${id}-desc`} className="mt-0.5 block text-[0.92rem] text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Lever-style on/off switch (`role="switch"`). Label sits left, switch right — good for settings rows. */
export function Toggle({ checked, onChange, label, description, disabled, className }: ToggleProps) {
  const id = useId();
  return (
    <div className={cn('flex items-center justify-between gap-6', disabled && 'opacity-55', className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-[1.05rem] leading-tight">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="mt-0.5 text-[0.92rem] text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => {
          uiSound('ui-toggle');
          onChange(!checked);
        }}
        className={cn(
          'wk-well relative h-8 w-16 shrink-0 cursor-pointer !rounded-full transition-colors disabled:cursor-not-allowed',
          checked && '!border-bronze-500 !bg-[linear-gradient(180deg,#3a2a14,#5a3e1d)]',
        )}
      >
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 size-6 -translate-y-1/2 rounded-full border-2 border-[#120c06] shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_2px_3px_rgb(0_0_0/0.6)] transition-[left,background] duration-200 ease-[var(--ease-thud)]',
            checked ? 'left-[calc(100%-1.6rem)] bg-[radial-gradient(circle_at_40%_35%,#f3dcae,#a8773d_60%,#5a3e1d)]' : 'left-0.5 bg-[radial-gradient(circle_at_40%_35%,#b5b9be,#4a4e54_60%,#26282b)]',
          )}
        />
        <span aria-hidden="true" className={cn('absolute top-1/2 -translate-y-1/2 font-heading text-[0.6rem] font-bold tracking-wider', checked ? 'left-2 text-bronze-200' : 'right-2 text-fg-subtle')}>
          {checked ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
}
