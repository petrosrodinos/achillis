import { useNavigate } from 'react-router-dom';
import { MessageScreen } from '@/components/layout/message-screen';
import { Button } from '@/ui';
import { Paths } from '@/routes/paths';
import { useSessionStore } from '@/stores/session-store';

/** 404 page. */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const signedIn = useSessionStore((s) => s.status === 'authenticated');
  return (
    <MessageScreen emblem={<span className="wk-gilded text-7xl font-black">404</span>} title="Lost in the wilds">
      This road leads nowhere. The map you followed may be old, or the page has been moved.
      <div className="mt-6 flex justify-center">
        <Button variant="primary" autoFocus onClick={() => navigate(signedIn ? Paths.menu : Paths.title)}>
          {signedIn ? 'Return to the main menu' : 'Return to the title'}
        </Button>
      </div>
    </MessageScreen>
  );
}
