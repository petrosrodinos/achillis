import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthMailService } from '../src/modules/auth/services/auth-mail.service';
import { createTestApp, registerAgent, uniqueUser, XHR } from './helpers';

const cookieNames = (res: request.Response): string[] =>
  ([] as string[])
    .concat(res.headers['set-cookie'] ?? [])
    .map((c) => c.split('=')[0]);

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mail: AuthMailService;

  beforeAll(async () => {
    app = await createTestApp();
    mail = app.get(AuthMailService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CSRF header', () => {
    it('rejects state-changing requests without X-Requested-With (403)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ identifier: 'x', password: 'y' });
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('X-Requested-With');
    });

    it('rejects a wrong header value', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .set('X-Requested-With', 'fetch')
        .send(uniqueUser())
        .expect(403);
    });

    it('allows GET requests without the header', async () => {
      await request(app.getHttpServer()).get('/api/leaderboard').expect(200);
    });
  });

  describe('register → login → me → refresh → logout', () => {
    it('runs the whole session lifecycle', async () => {
      const server = app.getHttpServer();
      const sendSpy = jest.spyOn(mail, 'sendVerificationEmail');
      const user = uniqueUser('lifecycle');
      const agent = request.agent(server);

      // Register: 201 + both cookies + MeResponse with defaults.
      const reg = await agent
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...user, email: user.email.toUpperCase() });
      expect(reg.status).toBe(201);
      expect(cookieNames(reg)).toEqual(
        expect.arrayContaining(['wk_access', 'wk_refresh']),
      );
      const setCookie = ([] as string[])
        .concat(reg.headers['set-cookie'])
        .join(';');
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie).toContain('Path=/api/auth');
      expect(reg.body.user).toMatchObject({
        email: user.email,
        username: user.username,
        emailVerified: false,
        profile: {
          level: 1,
          xp: 0,
          totalPoints: 0,
          title: 'Squire',
          xpForNextLevel: 500,
          xpIntoLevel: 0,
        },
        settings: {
          difficulty: 'knight',
          masterVolume: 0.8,
          keyBindings: { dodge: ['Space'], block: ['ShiftLeft', 'ShiftRight'] },
        },
        unlockedCharacters: ['white-knight'],
      });
      expect(reg.body.user.password).toBeUndefined();
      expect(sendSpy).toHaveBeenCalledWith(
        user.email,
        user.username,
        expect.any(String),
      );

      // Verify email with the token that would have been emailed.
      const verifyToken = sendSpy.mock.calls.at(-1)![2];
      await agent
        .post('/api/auth/verify-email')
        .set(XHR)
        .send({ token: verifyToken })
        .expect(200, { ok: true });
      await agent
        .post('/api/auth/verify-email')
        .set(XHR)
        .send({ token: verifyToken })
        .expect(400);

      // Me via cookie.
      const me = await agent.get('/api/me').expect(200);
      expect(me.body.emailVerified).toBe(true);

      // Fresh login by username (case-insensitive) and by email.
      const login = await agent.post('/api/auth/login').set(XHR).send({
        identifier: user.username.toUpperCase(),
        password: user.password,
      });
      expect(login.status).toBe(200);
      expect(cookieNames(login)).toEqual(
        expect.arrayContaining(['wk_access', 'wk_refresh']),
      );
      await request(server)
        .post('/api/auth/login')
        .set(XHR)
        .send({ identifier: user.email, password: user.password })
        .expect(200);
      await request(server)
        .post('/api/auth/login')
        .set(XHR)
        .send({ identifier: user.email, password: 'Wrong12345' })
        .expect(401);

      // Refresh rotates the refresh cookie.
      const refreshCookie = ([] as string[])
        .concat(login.headers['set-cookie'])
        .find((c) => c.startsWith('wk_refresh='))!;
      const oldRefresh = refreshCookie.split(';')[0];
      const refreshed = await agent
        .post('/api/auth/refresh')
        .set(XHR)
        .expect(200, { ok: true });
      expect(cookieNames(refreshed)).toEqual(
        expect.arrayContaining(['wk_access', 'wk_refresh']),
      );
      await agent.get('/api/me').expect(200);

      // Reusing the rotated (old) refresh token is rejected and revokes the whole family.
      await request(server)
        .post('/api/auth/refresh')
        .set(XHR)
        .set('Cookie', oldRefresh)
        .expect(401);
      await agent.post('/api/auth/refresh').set(XHR).expect(401);

      // Log in again, then logout clears cookies and revokes the session.
      await agent
        .post('/api/auth/login')
        .set(XHR)
        .send({ identifier: user.email, password: user.password })
        .expect(200);
      const logout = await agent.post('/api/auth/logout').set(XHR).expect(204);
      expect(cookieNames(logout)).toEqual(
        expect.arrayContaining(['wk_access', 'wk_refresh']),
      );
      await agent.get('/api/me').expect(401);
      await agent.post('/api/auth/refresh').set(XHR).expect(401);
    });

    it('accepts a Bearer access token as a fallback', async () => {
      const { agent } = await registerAgent(app, 'bearer');
      const login = await agent.get('/api/me').expect(200);
      expect(login.body.username).toBeDefined();
      await request(app.getHttpServer())
        .get('/api/me')
        .set('Authorization', 'Bearer not-a-token')
        .expect(401);
    });
  });

  describe('register validation', () => {
    it('rejects duplicates case-insensitively (409)', async () => {
      const { user } = await registerAgent(app, 'dup');
      const server = app.getHttpServer();
      await request(server)
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...uniqueUser('other'), username: user.username.toUpperCase() })
        .expect(409);
      await request(server)
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...uniqueUser('other'), email: user.email.toUpperCase() })
        .expect(409);
    });

    it.each([
      [{ username: 'ab' }, 'username'],
      [{ username: 'has space' }, 'username'],
      [{ password: 'short1' }, 'password'],
      [{ password: 'nodigitshere' }, 'password'],
      [{ email: 'not-an-email' }, 'email'],
    ])('rejects invalid input %j', async (override, field) => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...uniqueUser(), ...override })
        .expect(400);
      expect(JSON.stringify(res.body.message)).toContain(field);
    });

    it('rejects profane usernames (incl. leetspeak)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...uniqueUser(), username: 'B1tch_Slayer' })
        .expect(400);
      expect(res.body.message).toBe('Username is not allowed');
    });

    it('rejects unknown body fields', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .set(XHR)
        .send({ ...uniqueUser(), role: 'ADMIN' })
        .expect(400);
    });
  });

  describe('password reset', () => {
    it('emails a token, resets the password and revokes sessions', async () => {
      const server = app.getHttpServer();
      const { agent, user } = await registerAgent(app, 'reset');
      const resetSpy = jest.spyOn(mail, 'sendPasswordResetEmail');

      await request(server)
        .post('/api/auth/forgot-password')
        .set(XHR)
        .send({ email: 'nobody@example.com' })
        .expect(202, { ok: true });
      await request(server)
        .post('/api/auth/forgot-password')
        .set(XHR)
        .send({ email: user.email })
        .expect(202, { ok: true });
      const token = resetSpy.mock.calls.at(-1)![2];

      await request(server)
        .post('/api/auth/reset-password')
        .set(XHR)
        .send({ token, password: 'weak' })
        .expect(400);
      await request(server)
        .post('/api/auth/reset-password')
        .set(XHR)
        .send({ token, password: 'Durendal777' })
        .expect(200, { ok: true });
      await request(server)
        .post('/api/auth/reset-password')
        .set(XHR)
        .send({ token, password: 'Durendal888' })
        .expect(400);

      await agent.post('/api/auth/refresh').set(XHR).expect(401);
      await request(server)
        .post('/api/auth/login')
        .set(XHR)
        .send({ identifier: user.email, password: user.password })
        .expect(401);
      await request(server)
        .post('/api/auth/login')
        .set(XHR)
        .send({ identifier: user.email, password: 'Durendal777' })
        .expect(200);
    });
  });

  describe('me/settings', () => {
    it('patches settings and validates key bindings', async () => {
      const { agent } = await registerAgent(app, 'settings');
      const res = await agent
        .patch('/api/me/settings')
        .set(XHR)
        .send({
          musicVolume: 0.25,
          difficulty: 'champion',
          keyBindings: { dodge: ['KeyX', 'Mouse1'] },
        })
        .expect(200);
      expect(res.body).toMatchObject({
        musicVolume: 0.25,
        difficulty: 'champion',
        keyBindings: { dodge: ['KeyX', 'Mouse1'], moveUp: ['KeyW'] },
      });

      await agent
        .patch('/api/me/settings')
        .set(XHR)
        .send({ keyBindings: { teleport: ['KeyT'] } })
        .expect(400);
      await agent
        .patch('/api/me/settings')
        .set(XHR)
        .send({ keyBindings: { dodge: ['Escape'] } })
        .expect(400);
      await agent
        .patch('/api/me/settings')
        .set(XHR)
        .send({ masterVolume: 2 })
        .expect(400);
      await agent
        .patch('/api/me/settings')
        .set(XHR)
        .send({ difficulty: 'legendary' })
        .expect(400);

      const me = await agent.get('/api/me').expect(200);
      expect(me.body.settings.difficulty).toBe('champion');
    });

    it('requires authentication', async () => {
      await request(app.getHttpServer()).get('/api/me').expect(401);
      await request(app.getHttpServer())
        .patch('/api/me/settings')
        .set(XHR)
        .send({})
        .expect(401);
    });
  });

  describe('telemetry', () => {
    it('accepts client errors (204) and caps payload size (413)', async () => {
      const server = app.getHttpServer();
      await request(server)
        .post('/api/telemetry/client-error')
        .set(XHR)
        .send({
          message: 'boom',
          url: 'http://localhost:5173/play',
          userAgent: 'jest',
          context: { missionId: 'm02' },
        })
        .expect(204);
      await request(server)
        .post('/api/telemetry/client-error')
        .set(XHR)
        .send({ message: 'x'.repeat(20_000), url: 'u', userAgent: 'a' })
        .expect(413);
    });
  });
});
