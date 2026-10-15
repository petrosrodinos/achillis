import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  backdateRun,
  createTestApp,
  registerAgent,
  victoryPayload,
  withDb,
  XHR,
} from './helpers';

describe('Progress, scoring & leaderboard (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const startRun = async (agent: request.SuperAgentTest, missionId: string) => {
    const res = await agent
      .post('/api/progress/mission-start')
      .set(XHR)
      .send({ missionId })
      .expect(201);
    expect(res.body).toEqual({
      runId: expect.any(String),
      runToken: expect.any(String),
      startedAt: expect.any(String),
    });
    return res.body as { runId: string; runToken: string };
  };

  it('starts with only m01 unlocked', async () => {
    const { agent } = await registerAgent(app, 'fresh');
    const res = await agent.get('/api/progress').expect(200);
    expect(res.body).toMatchObject({
      saveVersion: 1,
      currentMissionId: 'm01',
      highestUnlockedMissionId: 'm01',
      trainingGroundsUnlocked: false,
      unlockedCharacters: ['white-knight'],
    });
    expect(res.body.missions).toHaveLength(15);
    expect(res.body.missions[0]).toEqual({
      missionId: 'm01',
      status: 'unlocked',
      bestScore: 0,
      bestTimeMs: null,
      completions: 0,
      bestRank: null,
    });
    expect(res.body.missions[1].status).toBe('locked');
  });

  it('rejects starting a locked mission (403) and unknown missions (400)', async () => {
    const { agent } = await registerAgent(app, 'locked');
    await agent
      .post('/api/progress/mission-start')
      .set(XHR)
      .send({ missionId: 'm02' })
      .expect(403);
    await agent
      .post('/api/progress/mission-start')
      .set(XHR)
      .send({ missionId: 'm99' })
      .expect(400);
  });

  it('mission-start → mission-complete → leaderboard', async () => {
    const { agent, user } = await registerAgent(app, 'hero');

    const run = await startRun(agent, 'm01');
    const saved = await agent.get('/api/progress').expect(200);
    expect(saved.body.missions[0].status).toBe('in_progress');
    expect(saved.body.currentMissionId).toBe('m01');

    await backdateRun(run.runId, 5 * 60_000);
    const res = await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken))
      .expect(200);

    // 2400 kills + 120 blocks + 70 dodges + 1500 time + 325 health + 400 lives = 4815, + 500 first clear
    expect(res.body).toMatchObject({
      accepted: true,
      score: 5315,
      rank: 'B',
      xpGained: 5315,
      levelUp: true,
      newlyUnlockedMissionId: 'm02',
      newlyUnlockedCharacters: [],
      personalBest: true,
      profile: { totalPoints: 5315, xp: 5315, level: 5, title: 'Man-at-Arms' },
    });
    const breakdownTotal = res.body.breakdown.reduce(
      (sum: number, b: { points: number }) => sum + b.points,
      0,
    );
    expect(breakdownTotal).toBe(5315);
    expect(res.body.progress.missions[0]).toMatchObject({
      status: 'completed',
      bestScore: 5315,
      bestTimeMs: 240_000,
      completions: 1,
      bestRank: 'B',
    });
    expect(res.body.progress.missions[1].status).toBe('unlocked');
    expect(res.body.progress).toMatchObject({
      highestUnlockedMissionId: 'm02',
      currentMissionId: 'm02',
    });

    // Global leaderboard (public) — highlights the current user and exposes only public fields.
    const anon = await request(app.getHttpServer())
      .get('/api/leaderboard')
      .expect(200);
    const entry = anon.body.data.find(
      (d: { username: string }) => d.username === user.username,
    );
    expect(entry).toEqual({
      rank: expect.any(Number),
      username: user.username,
      level: 5,
      points: 5315,
      bestTimeMs: null,
      isCurrentUser: false,
    });
    expect(anon.body.me).toBeNull();

    const mine = await agent
      .get('/api/leaderboard?scope=global&window=weekly')
      .expect(200);
    expect(
      mine.body.data.find(
        (d: { username: string }) => d.username === user.username,
      ).isCurrentUser,
    ).toBe(true);
    expect(mine.body.me).toMatchObject({
      username: user.username,
      points: 5315,
    });

    const byTime = await agent
      .get(
        '/api/leaderboard?scope=mission&missionId=m01&sort=time&window=monthly',
      )
      .expect(200);
    expect(byTime.body.me).toMatchObject({
      username: user.username,
      bestTimeMs: 240_000,
      points: 5315,
    });

    const me = await agent
      .get('/api/leaderboard/me?scope=mission&missionId=m01')
      .expect(200);
    expect(me.body).toMatchObject({
      rank: expect.any(Number),
      username: user.username,
      points: 5315,
    });
    await request(app.getHttpServer()).get('/api/leaderboard/me').expect(401);
    await request(app.getHttpServer())
      .get('/api/leaderboard?scope=global&sort=time')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/leaderboard?scope=mission')
      .expect(400);
  });

  it('pages the leaderboard and reports `me` outside the page', async () => {
    const { agent, user } = await registerAgent(app, 'pager');
    const run = await startRun(agent, 'm01');
    await backdateRun(run.runId, 5 * 60_000);
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(
        victoryPayload(run.runToken, {
          kills: {},
          perfectBlocks: 0,
          dodges: 0,
          durationMs: 290_000,
        }),
      )
      .expect(200);

    const res = await agent.get('/api/leaderboard?limit=1&page=1').expect(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 1,
      hasPrev: false,
    });
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
    expect(res.body.me).toMatchObject({ username: user.username });
    expect(res.body.me.rank).toBeGreaterThan(1);
  });

  it('rejects a replayed run token (422)', async () => {
    const { agent } = await registerAgent(app, 'replay');
    const run = await startRun(agent, 'm01');
    await backdateRun(run.runId, 5 * 60_000);
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken))
      .expect(200);
    const replay = await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken))
      .expect(422);
    expect(replay.body.message).toBe('Run has already been submitted');
  });

  it('rejects implausible durations (422) and closes the run', async () => {
    const { agent } = await registerAgent(app, 'cheat');

    // Faster than the m01 minimum (60 s).
    const fast = await startRun(agent, 'm01');
    await backdateRun(fast.runId, 5 * 60_000);
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(fast.runToken, { durationMs: 10_000 }))
      .expect(422);
    const status = await withDb((db) =>
      db.query('SELECT status FROM game_runs WHERE id = $1', [fast.runId]),
    );
    expect(status.rows[0].status).toBe('rejected');

    // Claims more time than the server measured since mission-start.
    const early = await startRun(agent, 'm01');
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(early.runToken))
      .expect(422);

    // Kills above the mission cap.
    const greedy = await startRun(agent, 'm01');
    await backdateRun(greedy.runId, 5 * 60_000);
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(greedy.runToken, { kills: { infantry: 100_000 } }))
      .expect(422);

    // Nothing was scored or unlocked.
    const progress = await agent.get('/api/progress').expect(200);
    expect(progress.body.missions[0].completions).toBe(0);
    expect(progress.body.missions[1].status).toBe('locked');
  });

  it("rejects another user's or a forged run token (422)", async () => {
    const owner = await registerAgent(app, 'owner');
    const thief = await registerAgent(app, 'thief');
    const run = await startRun(owner.agent, 'm01');
    await backdateRun(run.runId, 5 * 60_000);
    await thief.agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken))
      .expect(422);
    await owner.agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken.slice(0, -4) + 'abcd'))
      .expect(422);
    // The genuine owner can still submit.
    await owner.agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken))
      .expect(200);
  });

  it('records defeats without score or unlocks', async () => {
    const { agent } = await registerAgent(app, 'defeat');
    const run = await startRun(agent, 'm01');
    const res = await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(
        victoryPayload(run.runToken, {
          outcome: 'defeat',
          durationMs: 0,
          healthRemainingPct: 0,
          kills: {},
        }),
      )
      .expect(200);
    expect(res.body).toMatchObject({
      accepted: true,
      score: 0,
      xpGained: 0,
      newlyUnlockedMissionId: null,
      personalBest: false,
    });
    expect(res.body.progress.missions[0].status).toBe('in_progress');
    expect(res.body.progress.missions[1].status).toBe('locked');
  });

  it('validates the result body (400 for wrong types / unknown enemy types)', async () => {
    const { agent } = await registerAgent(app, 'badbody');
    const run = await startRun(agent, 'm01');
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken, { kills: { dragon: 1 } }))
      .expect(400);
    await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(victoryPayload(run.runToken, { durationMs: 'fast' }))
      .expect(400);
  });

  it('unlocks story characters and the Emperor Knight', async () => {
    const { agent, me } = await registerAgent(app, 'emperor');
    // Fast-forward the save: m01–m03 completed with a high total, m04 unlocked.
    await withDb(async (db) => {
      for (const [missionId, best] of [
        ['m01', 20_000],
        ['m02', 20_000],
        ['m03', 15_000],
      ] as const) {
        await db.query(
          `INSERT INTO mission_progress (id, user_id, mission_id, status, best_score, completions, updated_at)
           VALUES (gen_random_uuid(), $1, $2, 'completed', $3, 1, now())
           ON CONFLICT (user_id, mission_id) DO UPDATE SET status = 'completed', best_score = $3, completions = 1`,
          [me.id, missionId, best],
        );
      }
      await db.query(
        `INSERT INTO mission_progress (id, user_id, mission_id, status, updated_at) VALUES (gen_random_uuid(), $1, 'm04', 'unlocked', now())`,
        [me.id],
      );
    });

    const run = await startRun(agent, 'm04');
    await backdateRun(run.runId, 10 * 60_000);
    const res = await agent
      .post('/api/progress/mission-complete')
      .set(XHR)
      .send(
        victoryPayload(run.runToken, {
          kills: { infantry: 30, spearman: 20, archer: 20, ghost: 5 },
          bossesDefeated: 1,
          durationMs: 500_000,
        }),
      )
      .expect(200);

    expect(res.body.newlyUnlockedMissionId).toBe('m05');
    expect(res.body.newlyUnlockedCharacters).toEqual([
      'bronze-knight',
      'mysterious-knight',
      'emperor-knight',
    ]);
    expect(res.body.profile.totalPoints).toBeGreaterThanOrEqual(60_000);
    expect(res.body.progress.unlockedCharacters).toEqual(
      expect.arrayContaining([
        'white-knight',
        'bronze-knight',
        'mysterious-knight',
        'emperor-knight',
      ]),
    );
    const profile = await withDb((db) =>
      db.query(
        'SELECT emperor_knight_unlocked_at FROM profiles WHERE user_id = $1',
        [me.id],
      ),
    );
    expect(profile.rows[0].emperor_knight_unlocked_at).not.toBeNull();
  });
});
