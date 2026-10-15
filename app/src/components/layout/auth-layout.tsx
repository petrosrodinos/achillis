import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Backdrop, Panel } from '@/ui';
import { Paths } from '@/routes/paths';
import { useMenuMusic } from '@/hooks/use-menu-music';

export interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Centered parchment card over the title art, used by all account screens. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  useMenuMusic();
  return (
    <Backdrop src="/assets/images/ui/title.webp" fallback="dusk" dim={0.5}>
      <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 px-3 py-8 sm:px-4 sm:py-10">
        <Link to={Paths.title} className="wk-gilded text-4xl font-black tracking-wide transition-transform hover:scale-[1.02] md:text-5xl" aria-label="White Knight — back to title">
          White Knight
        </Link>
        <Panel surface="parchment" metal="bronze" padding="lg" className="w-full max-w-md animate-rise-in !px-5 sm:!px-7" aria-labelledby="auth-title">
          <h1 id="auth-title" className="wk-engraved text-center text-2xl text-oxblood-700">{title}</h1>
          {subtitle && <p className="mt-1 text-center text-ink-muted">{subtitle}</p>}
          <hr className="wk-divider my-4" />
          {children}
        </Panel>
        {footer && <div className="text-center text-fg-muted">{footer}</div>}
      </main>
    </Backdrop>
  );
}
