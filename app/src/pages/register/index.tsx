import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { FormError, darkLinkClass } from '@/components/form/form-error';
import { Button, IconCheck, PasswordInput, TextInput, cn, toast, uiSound } from '@/ui';
import { useRegister } from '@/features/auth/hooks/use-auth';
import { passwordChecks, registerSchema, zodFieldErrors, type RegisterForm } from '@/features/auth/validation-schemas/auth.schema';
import { fieldErrorsFrom } from '@/api/errors';
import { Paths } from '@/routes/paths';
import { safeNext } from '@/routes/guards';

type Field = keyof RegisterForm;
type Errors = Partial<Record<Field | '_form', string>>;

/** Account creation with live validation (contracts §2.1 rules) and server errors mapped to fields. */
export default function RegisterPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState<RegisterForm>({ email: '', username: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const clientErrors = useMemo<Errors>(() => {
    const r = registerSchema.safeParse(form);
    return r.success ? {} : zodFieldErrors<Field>(r.error);
  }, [form]);

  const errorFor = (k: Field) => serverErrors[k] ?? (touched[k] || submitted ? clientErrors[k] : undefined);

  const set = (k: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (serverErrors[k] || serverErrors._form) setServerErrors((x) => ({ ...x, [k]: undefined, _form: undefined }));
  };
  const blur = (k: Field) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      uiSound('ui-error');
      return;
    }
    const { email, username, password } = parsed.data;
    register.mutate(
      { email, username, password },
      {
        onSuccess: () => {
          uiSound('unlock');
          toast.success('Welcome to the realm!', { description: 'We sent a verification link to your email.' });
          navigate(safeNext(params.get('next')) ?? Paths.menu, { replace: true });
        },
        onError: (err) => {
          uiSound('ui-error');
          setServerErrors(fieldErrorsFrom(err, ['email', 'username', 'password'] as const));
        },
      },
    );
  };

  const checks = passwordChecks(form.password);

  return (
    <AuthLayout
      title="Create account"
      subtitle="Swear your oath and take up the white shield."
      footer={
        <>
          Already sworn?{' '}
          <Link to={{ pathname: Paths.login, search: params.toString() ? `?${params}` : '' }} className={darkLinkClass}>
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormError>{serverErrors._form}</FormError>
        <TextInput label="Email" type="email" name="email" autoComplete="email" autoFocus value={form.email} onChange={set('email')} onBlur={blur('email')} error={errorFor('email')} />
        <TextInput
          label="Username"
          name="username"
          autoComplete="username"
          value={form.username}
          onChange={set('username')}
          onBlur={blur('username')}
          error={errorFor('username')}
          hint="3–20 letters, numbers or underscores. Shown on leaderboards."
          maxLength={20}
        />
        <div>
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            onBlur={blur('password')}
            error={errorFor('password')}
            aria-describedby="pw-rules"
          />
          <ul id="pw-rules" className="mt-2 flex flex-wrap gap-x-4 gap-y-1" aria-label="Password requirements">
            {checks.map((c) => (
              <li key={c.id} className={cn('flex items-center gap-1 text-[0.92rem] transition-colors', c.ok ? 'text-forest-700' : 'text-ink-muted')}>
                <span className={cn('inline-flex size-4 items-center justify-center rounded-full border', c.ok ? 'border-forest-600 bg-forest-600 text-parchment-50' : 'border-ink-muted/60')}>
                  {c.ok && <IconCheck size={11} />}
                </span>
                {c.label}
                <span className="sr-only">{c.ok ? '(met)' : '(not met)'}</span>
              </li>
            ))}
          </ul>
        </div>
        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          onBlur={blur('confirmPassword')}
          error={errorFor('confirmPassword')}
        />
        <Button type="submit" variant="primary" size="lg" block loading={register.isPending} clickSound={null}>
          Take the oath
        </Button>
      </form>
    </AuthLayout>
  );
}
