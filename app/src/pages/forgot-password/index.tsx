import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { FormError, darkLinkClass } from '@/components/form/form-error';
import { Button, IconMail, TextInput, uiSound } from '@/ui';
import { useForgotPassword } from '@/features/auth/hooks/use-auth';
import { forgotPasswordSchema, zodFieldErrors } from '@/features/auth/validation-schemas/auth.schema';
import { errorMessage } from '@/api/errors';
import { Paths } from '@/routes/paths';

/** Request a password-reset email. Always shows the same confirmation (no account enumeration). */
export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(zodFieldErrors<'email'>(parsed.error).email);
      uiSound('ui-error');
      return;
    }
    forgot.mutate(parsed.data.email, {
      onSuccess: () => {
        setSent(true);
        uiSound('ui-confirm');
      },
      onError: (err) => setFormError(errorMessage(err)),
    });
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle={sent ? undefined : 'We will send a raven with a reset link.'}
      footer={
        <Link to={Paths.login} className={darkLinkClass}>
          Back to login
        </Link>
      }
    >
      {sent ? (
        <div role="status" className="flex flex-col items-center gap-3 text-center">
          <IconMail size={40} className="text-oxblood-700" />
          <p className="text-lg text-ink">
            If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way. It expires soon, so check your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormError>{formError}</FormError>
          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(undefined);
              setFormError(undefined);
            }}
            error={error}
          />
          <Button type="submit" variant="primary" size="lg" block loading={forgot.isPending} clickSound={null}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
