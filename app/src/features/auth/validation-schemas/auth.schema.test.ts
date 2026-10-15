import { describe, expect, it } from 'vitest';
import { loginSchema, passwordChecks, registerSchema, resetPasswordSchema, zodFieldErrors } from './auth.schema';

const valid = { email: 'knight@realm.test', username: 'Sir_Gawain7', password: 'excalibur1', confirmPassword: 'excalibur1' };

function errorsFor(input: Partial<typeof valid>) {
  const r = registerSchema.safeParse({ ...valid, ...input });
  return r.success ? {} : zodFieldErrors<string>(r.error);
}

describe('register schema (contracts §2.1)', () => {
  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('validates email', () => {
    expect(errorsFor({ email: '' }).email).toBeDefined();
    expect(errorsFor({ email: 'not-an-email' }).email).toMatch(/valid email/i);
    expect(errorsFor({ email: '  knight@realm.test  ' }).email).toBeUndefined();
  });

  it.each([
    ['ab', /at least 3/],
    ['a'.repeat(21), /at most 20/],
    ['sir gawain', /letters, numbers and underscores/],
    ['sir-gawain', /letters, numbers and underscores/],
    ['gáwain', /letters, numbers and underscores/],
  ])('rejects username %j', (username, msg) => {
    expect(errorsFor({ username }).username).toMatch(msg);
  });

  it.each(['abc', 'Knight_01', 'a'.repeat(20), '___'])('accepts username %j', (username) => {
    expect(errorsFor({ username }).username).toBeUndefined();
  });

  it.each([
    ['short1', /at least 8/],
    ['a1'.repeat(37), /at most 72/],
    ['onlyletters', /one number/],
    ['12345678', /one letter/],
  ])('rejects password %j', (password, msg) => {
    expect(errorsFor({ password, confirmPassword: password }).password).toMatch(msg);
  });

  it('accepts boundary passwords (8 and 72 chars)', () => {
    for (const password of ['abcdefg1', `${'a'.repeat(71)}1`]) {
      expect(errorsFor({ password, confirmPassword: password }).password).toBeUndefined();
    }
  });

  it('requires matching confirmation', () => {
    expect(errorsFor({ confirmPassword: 'different1' }).confirmPassword).toMatch(/do not match/);
  });

  it('password checklist mirrors the rules', () => {
    expect(passwordChecks('abc').map((c) => c.ok)).toEqual([false, true, false]);
    expect(passwordChecks('abcdefg1').every((c) => c.ok)).toBe(true);
  });
});

describe('login / reset schemas', () => {
  it('login needs identifier and password', () => {
    expect(loginSchema.safeParse({ identifier: '  ', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ identifier: 'gawain', password: 'x' }).success).toBe(true);
  });

  it('reset enforces the password rules and confirmation', () => {
    expect(resetPasswordSchema.safeParse({ password: 'abcdefg1', confirmPassword: 'abcdefg1' }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ password: 'abcdefgh', confirmPassword: 'abcdefgh' }).success).toBe(false);
  });
});
