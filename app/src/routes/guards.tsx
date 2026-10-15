import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '@/stores/session-store';
import { LoadingScreen } from '@/ui';
import { useDeviceSupport } from '@/hooks/use-device-support';
import { UnsupportedScreen } from '@/pages/unsupported';
import { Paths } from './paths';

/** Only allow same-origin relative paths as post-login destinations. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null;
  return next;
}

/** Gameplay and menu routes: signed-in users only; others go to /login?next=… */
export function RequireAuth() {
  const status = useSessionStore((s) => s.status);
  const endReason = useSessionStore((s) => s.endReason);
  const location = useLocation();
  if (status === 'loading') return <LoadingScreen label="Opening the gates…" tips={[]} />;
  if (status === 'anonymous') {
    if (endReason === 'logout') return <Navigate to={Paths.title} replace />;
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`${Paths.login}?next=${encodeURIComponent(next)}`} replace />;
  }
  return <Outlet />;
}

/** Title / login / register: signed-in users are sent on (to `next` or the main menu). */
export function GuestOnly() {
  const status = useSessionStore((s) => s.status);
  const [params] = useSearchParams();
  if (status === 'loading') return <LoadingScreen label="Opening the gates…" tips={[]} />;
  if (status === 'authenticated') return <Navigate to={safeNext(params.get('next')) ?? Paths.menu} replace />;
  return <Outlet />;
}

/** Blocks the game route on unsupported devices with a clear explanation. */
export function RequireDeviceSupport({ children }: { children?: ReactNode }) {
  const support = useDeviceSupport();
  if (!support.supported) return <UnsupportedScreen support={support} />;
  return children ?? <Outlet />;
}
