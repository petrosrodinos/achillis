import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';
import { getFocusable, trapTab } from './focus';
import { Panel, type FrameMetal, type PanelSurface } from './panel';
import { IconClose } from './icons';
import { uiSound } from './hooks';

export interface ModalProps {
  open: boolean;
  /** Called on Esc, backdrop click or the close button. */
  onClose: () => void;
  title: ReactNode;
  /** Optional description, wired to aria-describedby. */
  description?: ReactNode;
  children?: ReactNode;
  /** Footer actions (right aligned). */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  metal?: FrameMetal;
  surface?: PanelSurface;
  /** Disable closing via Esc / backdrop (e.g. while saving). */
  dismissible?: boolean;
  /** Element to focus on open; defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' } as const;

/**
 * Accessible modal dialog: rendered in a portal, `role="dialog"` + `aria-modal`, focus trapped,
 * Esc / backdrop close, focus restored to the opener on close, background scroll locked.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  metal = 'bronze',
  surface = 'dark',
  dismissible = true,
  initialFocusRef,
  className,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    const target = initialFocusRef?.current ?? (root ? getFocusable(root)[0] : null) ?? root;
    target?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open, initialFocusRef]);

  if (!open || typeof document === 'undefined') return null;

  const close = () => {
    if (!dismissible) return;
    uiSound('ui-back');
    onCloseRef.current();
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-night-950/80 backdrop-blur-[2px]"
        aria-hidden="true"
        onMouseDown={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn('relative w-full animate-slam-in outline-none', widths[size])}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            close();
          } else if (dialogRef.current) {
            trapTab(e, dialogRef.current);
          }
        }}
      >
        <Panel metal={metal} surface={surface} padding="lg" as="div" className={cn('max-h-[88dvh] overflow-y-auto !px-4 sm:!px-7', className)}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="wk-engraved text-xl text-accent-strong in-[.wk-frame--parchment]:text-oxblood-700">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-fg-muted in-[.wk-frame--parchment]:text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="relative z-[2] -mr-1 -mt-1 rounded p-1.5 pointer-coarse:p-2.5 text-fg-muted transition-colors hover:bg-bronze-700/25 hover:text-parchment-50 in-[.wk-frame--parchment]:text-ink-muted"
              >
                <IconClose size={20} />
              </button>
            )}
          </div>
          {children}
          {footer && <div className="mt-6 flex flex-wrap items-center justify-end gap-3">{footer}</div>}
        </Panel>
      </div>
    </div>,
    document.body,
  );
}
