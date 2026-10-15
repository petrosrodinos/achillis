import { MessageScreen } from '@/components/layout/message-screen';
import { Button, IconRefresh, IconWarning } from '@/ui';
import { Paths } from '@/routes/paths';

export interface ErrorScreenProps {
  error?: Error;
  /** Retry rendering (from the ErrorBoundary). */
  reset?: () => void;
}

/**
 * Generic error page — the ErrorBoundary fallback and the `/error` route. Uses plain anchors for
 * navigation so it works even if the router itself failed.
 */
export function ErrorScreen({ error, reset }: ErrorScreenProps) {
  return (
    <MessageScreen emblem={<IconWarning size={56} className="text-oxblood-300" />} title="A misfortune befell us">
      Something broke while drawing this screen. The scribes have been told.
      {import.meta.env.DEV && error && (
        <pre className="mt-4 max-h-40 overflow-auto rounded-[3px] bg-night-950 p-3 text-left text-[0.8rem] text-danger-fg">{error.message}</pre>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {reset && (
          <Button variant="primary" leadingIcon={<IconRefresh size={18} />} onClick={reset} autoFocus>
            Try again
          </Button>
        )}
        <Button onClick={() => window.location.assign(Paths.menu)}>Main menu</Button>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </MessageScreen>
  );
}

/** `/error` route. */
export default function ErrorPage() {
  return <ErrorScreen />;
}
