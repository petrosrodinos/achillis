import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Backdrop, Button, IconChevronLeft, LevelBadge, cn, type ArtFallback } from '@/ui';
import { useSessionStore } from '@/stores/session-store';
import { Paths } from '@/routes/paths';
import { useMenuMusic } from '@/hooks/use-menu-music';

export interface ScreenShellProps {
  title: ReactNode;
  /** Engraved label above the title. */
  eyebrow?: ReactNode;
  /** Back target; Escape also navigates here. Omit on top-level screens. */
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  backdrop?: string;
  fallback?: ArtFallback;
  /** Max content width. */
  width?: 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const widths = { md: 'max-w-3xl', lg: 'max-w-5xl', xl: 'max-w-7xl', full: 'max-w-none' } as const;

/** Signed-in user chip for the top bar. */
function UserChip() {
  const me = useSessionStore((s) => s.me);
  if (!me) return null;
  return (
    <Link
      to={Paths.profile}
      className="group flex items-center gap-2.5 rounded-[4px] border-2 border-transparent px-2 py-1 transition-colors hover:border-bronze-700/70 hover:bg-night-800/60"
    >
      <LevelBadge level={me.profile.level} size="sm" />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-[0.92rem] font-bold text-parchment-50">{me.username}</span>
        <span className="text-[0.85rem] italic text-fg-muted">{me.profile.title}</span>
      </span>
    </Link>
  );
}

/**
 * Standard menu screen frame: menu backdrop art, top bar (back, title, user chip),
 * centred content column. Esc returns to `backTo`. Starts menu music.
 */
export function ScreenShell({
  title,
  eyebrow,
  backTo,
  backLabel = 'Back',
  actions,
  children,
  backdrop = '/assets/images/ui/menu.webp',
  fallback = 'dusk',
  width = 'lg',
  className,
}: ScreenShellProps) {
  const navigate = useNavigate();
  useMenuMusic();

  useEffect(() => {
    if (!backTo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, [role="dialog"], [role="listbox"]')) return;
      navigate(backTo);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [backTo, navigate]);

  return (
    <Backdrop src={backdrop} fallback={fallback} dim={0.55}>
      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {backTo && (
              <Button variant="secondary" size="sm" leadingIcon={<IconChevronLeft size={16} />} onClick={() => navigate(backTo)} clickSound="ui-back" aria-keyshortcuts="Escape">
                {backLabel}
              </Button>
            )}
          </div>
          <UserChip />
        </header>
        <main id="main" className={cn('mx-auto flex w-full min-w-0 flex-1 flex-col px-4 pb-10 sm:px-5 md:px-8', widths[width], className)}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-rise-in">
            <div>
              {eyebrow && <p className="wk-engraved mb-1 text-[0.8rem] text-accent">{eyebrow}</p>}
              <h1 className="wk-engraved text-2xl text-parchment-50 min-[400px]:text-3xl md:text-4xl">{title}</h1>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </Backdrop>
  );
}
