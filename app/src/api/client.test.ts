import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';
import { ApiError } from './errors';

const json = (status: number, body: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;

function setup(handler: Handler) {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => Promise.resolve(handler(String(input), init ?? {})));
  const sleep = vi.fn(() => Promise.resolve());
  const client = createApiClient({ baseUrl: '/api', fetch: fetchMock as unknown as typeof fetch, sleep });
  const onAuthFailure = vi.fn();
  client.setAuthFailureHandler(onAuthFailure);
  const calls = () => fetchMock.mock.calls.map(([u, i]) => `${(i as RequestInit).method} ${String(u)}`);
  return { client, fetchMock, sleep, onAuthFailure, calls };
}

describe('api client', () => {
  it('sends credentials, CSRF header and JSON body', async () => {
    const { client, fetchMock } = setup(() => json(200, { ok: true }));
    await client.post('/auth/login', { identifier: 'a', password: 'b' });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/auth/login');
    expect(init.credentials).toBe('include');
    expect((init.headers as Record<string, string>)['X-Requested-With']).toBe('XMLHttpRequest');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ identifier: 'a', password: 'b' }));
  });

  it('builds query strings and skips empty values', async () => {
    const { client, fetchMock } = setup(() => json(200, {}));
    await client.get('/leaderboard', { scope: 'global', missionId: undefined, page: 2 });
    expect(fetchMock.mock.calls[0][0]).toBe('/api/leaderboard?scope=global&page=2');
  });

  it('refreshes once on 401 and retries the original request', async () => {
    let refreshed = false;
    const { client, calls, onAuthFailure } = setup((url) => {
      if (url.endsWith('/auth/refresh')) {
        refreshed = true;
        return json(200, { ok: true });
      }
      return refreshed ? json(200, { id: 'u1' }) : json(401, { statusCode: 401, message: 'Unauthorized' });
    });
    await expect(client.get('/me')).resolves.toEqual({ id: 'u1' });
    expect(calls()).toEqual(['GET /api/me', 'POST /api/auth/refresh', 'GET /api/me']);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it('shares a single refresh between concurrent 401s', async () => {
    let refreshed = false;
    let refreshCalls = 0;
    const { client } = setup(async (url) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCalls++;
        await new Promise((r) => setTimeout(r, 5));
        refreshed = true;
        return json(200, { ok: true });
      }
      return refreshed ? json(200, { url }) : json(401, { message: 'Unauthorized' });
    });
    const results = await Promise.all([client.get('/me'), client.get('/progress'), client.get('/leaderboard')]);
    expect(results).toHaveLength(3);
    expect(refreshCalls).toBe(1);
  });

  it('signals auth failure and throws 401 when refresh fails', async () => {
    const { client, onAuthFailure, calls } = setup((url) =>
      url.endsWith('/auth/refresh') ? json(401, { message: 'Invalid refresh token' }) : json(401, { message: 'Unauthorized' }),
    );
    const err = await client.get('/me').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(401);
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(calls()).toEqual(['GET /api/me', 'POST /api/auth/refresh']);
  });

  it('does not retry more than once after a successful refresh', async () => {
    const { client, onAuthFailure, calls } = setup((url) => (url.endsWith('/auth/refresh') ? json(200, { ok: true }) : json(401, {})));
    await expect(client.get('/me')).rejects.toMatchObject({ status: 401 });
    expect(calls()).toEqual(['GET /api/me', 'POST /api/auth/refresh', 'GET /api/me']);
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
  });

  it('does not refresh for login failures', async () => {
    const { client, calls, onAuthFailure } = setup(() => json(401, { message: 'Invalid credentials' }));
    await expect(client.post('/auth/login', {})).rejects.toMatchObject({ status: 401, messages: ['Invalid credentials'] });
    expect(calls()).toEqual(['POST /api/auth/login']);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it('retries network errors with backoff for idempotent requests', async () => {
    let n = 0;
    const { client, sleep } = setup(() => {
      n++;
      if (n < 3) throw new TypeError('Failed to fetch');
      return json(200, { ok: 1 });
    });
    await expect(client.get('/progress')).resolves.toEqual({ ok: 1 });
    expect(n).toBe(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    const delays = sleep.mock.calls.map((c) => (c as unknown as [number])[0]);
    expect(delays[1]).toBeGreaterThan(delays[0]);
  });

  it('does not retry network errors for non-idempotent requests', async () => {
    let n = 0;
    const { client } = setup(() => {
      n++;
      throw new TypeError('Failed to fetch');
    });
    const err = await client.post('/progress/mission-complete', {}).catch((e) => e);
    expect(n).toBe(1);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).isNetworkError).toBe(true);
  });

  it('gives up after the retry budget', async () => {
    let n = 0;
    const { client } = setup(() => {
      n++;
      throw new TypeError('offline');
    });
    await expect(client.get('/me')).rejects.toMatchObject({ status: 0 });
    expect(n).toBe(4); // 1 + 3 retries
  });

  it('parses Nest validation errors into messages', async () => {
    const { client } = setup(() => json(400, { statusCode: 400, message: ['username must be longer', 'email must be an email'], error: 'Bad Request' }));
    const err = (await client.post('/auth/register', {}).catch((e) => e)) as ApiError;
    expect(err.status).toBe(400);
    expect(err.messages).toEqual(['username must be longer', 'email must be an email']);
    expect(err.code).toBe('Bad Request');
  });

  it('returns undefined for 204', async () => {
    const { client } = setup(() => new Response(null, { status: 204 }));
    await expect(client.post('/auth/logout')).resolves.toBeUndefined();
  });
});
