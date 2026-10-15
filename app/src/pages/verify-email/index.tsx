import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { FormError, darkLinkClass } from '@/components/form/form-error';
import { Button, IconCheck, Spinner } from '@/ui';
import { useVerifyEmail } from '@/features/auth/hooks/use-auth';
import { errorMessage, isApiError } from '@/api/errors';
import { Paths } from '@/routes/paths';
import { useSessionStore } from '@/stores/session-store';

/** Confirms an email address from the emailed link (`?token=`), once, on mount. */
export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const verify = useVerifyEmail();
  const status = useSessionStore((s) => s.status);
  const fired = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || fired.current) return;
    fired.current = true;
    verify.mutate(token);
  }, [token, verify]);

  const next = status === 'authenticated' ? Paths.menu : Paths.login;
  const nextLabel = status === 'authenticated' ? 'Go to main menu' : 'Login';

  return (
    <AuthLayout title="Verify email" footer={<Link to={Paths.title} className={darkLinkClass}>Back to title</Link>}>
      <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
        {!token ? (
          <FormError>This verification link is incomplete. Please use the full link from your email.</FormError>
        ) : verify.isSuccess ? (
          <>
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-forest-700 bg-forest-600 text-parchment-50">
              <IconCheck size={30} />
            </span>
            <p className="text-lg text-ink">Your email is confirmed. The realm knows your name.</p>
          </>
        ) : verify.isError ? (
          <FormError>
            {isApiError(verify.error) && verify.error.status >= 400 && verify.error.status < 500
              ? 'This verification link is invalid or has expired. You can request a new one from your profile.'
              : errorMessage(verify.error)}
          </FormError>
        ) : (
          <p className="flex items-center gap-2 text-lg text-ink">
            <Spinner size={18} /> Checking the royal seal…
          </p>
        )}
        <Button variant="primary" onClick={() => navigate(next)}>
          {nextLabel}
        </Button>
      </div>
    </AuthLayout>
  );
}
