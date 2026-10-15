import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { FormError, darkLinkClass, inkLinkClass } from '@/components/form/form-error';
import { Button, PasswordInput, TextInput, uiSound } from '@/ui';
import { useLogin } from '@/features/auth/hooks/use-auth';
import { loginSchema, zodFieldErrors, type LoginForm } from '@/features/auth/validation-schemas/auth.schema';
import { errorMessage, isApiError } from '@/api/errors';
import { Paths } from '@/routes/paths';
import { safeNext } from '@/routes/guards';

type Errors = Partial<Record<keyof LoginForm | '_form', string>>;

/** Login with email or username. Redirects to `?next=` (same-origin only) or the main menu. */
export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const login = useLogin();
  const [form, setForm] = useState<LoginForm>({ identifier: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});

  const set = (k: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k] || errors._form) setErrors((x) => ({ ...x, [k]: undefined, _form: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      uiSound('ui-error');
      return;
    }
    login.mutate(parsed.data, {
      onSuccess: () => {
        uiSound('ui-confirm');
        navigate(safeNext(params.get('next')) ?? Paths.menu, { replace: true });
      },
      onError: (err) => {
        uiSound('ui-error');
        setErrors({
          _form: isApiError(err) && (err.status === 401 || err.status === 400) ? 'That email/username and password do not match.' : errorMessage(err),
        });
      },
    });
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Welcome back, knight."
      footer={
        <>
          New to the realm?{' '}
          <Link to={{ pathname: Paths.register, search: params.toString() ? `?${params}` : '' }} className={darkLinkClass}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormError>{errors._form}</FormError>
        <TextInput
          label="Email or username"
          name="identifier"
          autoComplete="username"
          autoFocus
          value={form.identifier}
          onChange={set('identifier')}
          error={errors.identifier}
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />
        <div className="-mt-1 text-right text-[0.98rem]">
          <Link to={Paths.forgotPassword} className={inkLinkClass}>
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" block loading={login.isPending} clickSound={null}>
          Enter the realm
        </Button>
      </form>
    </AuthLayout>
  );
}
