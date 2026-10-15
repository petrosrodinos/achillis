import type { ReactNode } from 'react';
import { Backdrop, Panel } from '@/ui';

export interface MessageScreenProps {
  /** Big engraved code or emblem, e.g. "404". */
  emblem?: ReactNode;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Centered message card (404, errors, unsupported device). */
export function MessageScreen({ emblem, title, children, actions }: MessageScreenProps) {
  return (
    <Backdrop src="/assets/images/ui/menu.webp" fallback="night" dim={0.6}>
      <main id="main" className="flex min-h-dvh items-center justify-center px-4 py-10">
        <Panel metal="bronze" padding="lg" className="w-full max-w-lg animate-slam-in text-center">
          {emblem && <div className="mb-2 flex justify-center">{emblem}</div>}
          <h1 className="wk-engraved text-2xl text-accent-strong">{title}</h1>
          <hr className="wk-divider my-4" />
          <div className="text-lg leading-snug text-fg-muted">{children}</div>
          {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
        </Panel>
      </main>
    </Backdrop>
  );
}
