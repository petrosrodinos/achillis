import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { FormError, darkLinkClass, inkLinkClass } from '@/components/form/form-error';
import { Button, PasswordInput, toast, uiSound } from '@/ui';
import { useResetPassword } from '@/features/auth/hooks/use-auth';
import { resetPasswordSchema, zodFieldErrors } from '@/features/auth/validation-schemas/auth.schema';
import { errorMessage, isApiError } from '@/api/errors';
import { Paths } from '@/routes/paths';
import { useSessionStore } from '@/stores/session-store';

type Errors = Partial<Record<'password' | 'confirmPassword' | '_form', string>>;

/** Set a new password using the emailed token (`?token=`). All sessions are revoked server-side. */
export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const reset = useResetPassword();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({});

  if (!token) {
    return (
      <AuthLayout title="Reset password" footer={<Link to={Paths.login} className={darkLinkClass}>Back to login</Link>}>
        <FormError>This reset link is incomplete. Please use the full link from your email.</FormError>
        <p className="mt-4 text-center">
          <Link to={Paths.forgotPassword} className={inkLinkClass}>Request a new link</Link>
        </p>
      </AuthLayout>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = resetPasswordSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      uiSound('ui-error');
      return;
    }
    reset.mutate(
      { token, password: parsed.data.password },
      {
        onSuccess: () => {
          uiSound('ui-confirm');
          // Server revoked every refresh token — reflect that locally.
          useSessionStore.getState().clear();
          toast.success('Password changed', { description: 'Login with your new password.' });
          navigate(Paths.login, { replace: true });
        },
        onError: (err) => {
          uiSound('ui-error');
          setErrors({
            _form: isApiError(err) && (err.status === 400 || err.status === 401 || err.status === 404) ? 'This reset link is invalid or has expired. Request a new one.' : errorMessage(err),
          });
        },
      },
    );
  };

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password." footer={<Link to={Paths.login} className={darkLinkClass}>Back to login</Link>}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormError>
          {errors._form}
          {errors._form && (
            <>
              {' '}
              <Link to={Paths.forgotPassword} className={inkLinkClass}>Request a new link</Link>
            </>
          )}
        </FormError>
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          autoFocus
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
          hint="8–72 characters with at least one letter and one number."
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
        />
        <Button type="submit" variant="primary" size="lg" block loading={reset.isPending} clickSound={null}>
          Set new password
        </Button>
      </form>
    </AuthLayout>
  );
}
