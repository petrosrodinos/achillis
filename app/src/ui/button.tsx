import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { Spinner } from './spinner';
import { uiSound, type UiSoundName } from './hooks';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, disables interaction and sets aria-busy. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  /** Stretch to the container width. */
  block?: boolean;
  /** UI sound on click (default 'ui-click'); `null` to mute. */
  clickSound?: UiSoundName | null;
  /** Hover sound is on by default for menu feel. */
  hoverSound?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'wk-plate wk-plate--bronze',
  secondary: 'wk-plate',
  danger: 'wk-plate wk-plate--oxblood',
  ghost:
    'border-2 border-transparent text-accent-strong hover:text-parchment-50 hover:bg-bronze-700/20 rounded-[var(--radius-plate)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  icon: 'wk-plate aspect-square !px-0',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-9 pointer-coarse:min-h-11 px-3.5 text-[0.8rem] gap-1.5',
  md: 'min-h-11 px-5 text-[0.92rem] gap-2',
  lg: 'min-h-14 px-7 text-[1.05rem] gap-2.5',
};

const iconSize: Record<ButtonSize, string> = { sm: 'w-9 pointer-coarse:w-11', md: 'w-11', lg: 'w-14' };

/**
 * Forged plate button. `primary` is gilded bronze, `secondary` aged iron, `danger` oxblood,
 * `ghost` a quiet text button, `icon` a square iron plate (provide `aria-label`).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    block,
    className,
    children,
    disabled,
    clickSound = 'ui-click',
    hoverSound = true,
    onClick,
    onMouseEnter,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap font-heading font-bold uppercase tracking-[0.12em] outline-offset-4',
        variantClass[variant],
        sizeClass[size],
        variant === 'icon' && iconSize[size],
        block && 'w-full',
        className,
      )}
      onMouseEnter={(e) => {
        if (hoverSound && !isDisabled) uiSound('ui-hover');
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        if (clickSound) uiSound(clickSound);
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 20 : 16} /> : leadingIcon}
      {children !== undefined && <span className={cn(loading && variant !== 'icon' && 'opacity-80')}>{children}</span>}
      {!loading && trailingIcon}
    </button>
  );
});
