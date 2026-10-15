import { describe, expect, it } from 'vitest';
import { MISSION_IDS } from '@/content/ids';
import { DuelConfigSchema } from '@/engines/duel/duel-config';
import { OpenFieldConfigSchema } from '@/engines/open-field/open-field-config';
import { QuestConfigSchema } from '@/engines/quest/quest-config';
import { MISSIONS } from './catalog';
import { MISSION_CONFIGS } from './configs';
import { createEngine, missionConfig } from './create-engine';

describe('mission configs', () => {
  it('has catalog metadata for all 15 missions in order', () => {
    expect(MISSIONS.map((m) => m.id)).toEqual([...MISSION_IDS]);
  });

  it.each(MISSION_IDS)('%s validates against its engine schema and matches the catalog engine', (id) => {
    const mc = missionConfig(id);
    const meta = MISSIONS.find((m) => m.id === id)!;
    expect(mc.engine).toBe(meta.engine);
    const schema = mc.engine === 'duel' ? DuelConfigSchema : mc.engine === 'quest' ? QuestConfigSchema : OpenFieldConfigSchema;
    const r = schema.safeParse(mc.config);
    if (!r.success) throw new Error(`${id}: ${JSON.stringify(r.error.issues, null, 2)}`);
  });

  it('uses the 5 / 10 / 15 wave scaling on three-slide ground quests', () => {
    for (const id of ['m03', 'm04', 'm05', 'm08', 'm10', 'm14'] as const) {
      const mc = MISSION_CONFIGS[id];
      if (mc.engine !== 'quest') throw new Error('expected quest');
      const totals = mc.config.slides.filter((s) => s.kind === 'ground').map((s) => (s.kind === 'ground' ? (s.waves ?? []).reduce((a, w) => a + w.count, 0) : 0));
      expect(totals).toEqual([5, 10, 15]);
    }
  });

  it('rejects invalid configs', () => {
    expect(DuelConfigSchema.safeParse({ arena: { env: 'forest', ground: 'grass' }, player: { character: 'white-knight' }, opponent: { ref: 'red-paladin' }, rounds: [{ mount: 'none', helmets: true, endsWhen: { type: 'hpAtOrBelow', hp: 50 } }] }).success).toBe(false);
    expect(QuestConfigSchema.safeParse({ playable: 'white-knight', slides: [{ kind: 'flight', title: 'x', env: 'storm-zone', hazards: [] }] }).success).toBe(false);
  });
});

describe('engine simulation smoke tests', () => {
  it.each(MISSION_IDS)('%s runs 90 simulated seconds without errors', (id) => {
    const engine = createEngine(id, { difficulty: 'knight', playerName: 'Tester', seed: 42 });
    const dt = 1 / 60;
    for (let i = 0; i < 90 * 60 && engine.status === 'playing'; i++) {
      engine.step(dt);
      engine.hud();
      engine.camera();
      engine.scene();
    }
    expect(['playing', 'victory', 'defeat']).toContain(engine.status);
    const p = engine.world.player;
    expect(p).toBeDefined();
    for (const f of engine.world.fighters) {
      expect(Number.isFinite(f.x)).toBe(true);
      expect(Number.isFinite(f.y)).toBe(true);
    }
  });

  it('an idle player eventually loses a duel against the AI', () => {
    const engine = createEngine('m07', { difficulty: 'champion', playerName: 'Tester', seed: 7, training: { player: 'white-knight', opponent: 'red-paladin', mounted: false } });
    for (let i = 0; i < 240 * 60 && engine.status === 'playing'; i++) engine.step(1 / 60);
    expect(engine.status).toBe('defeat');
    expect(engine.outcome()?.stats.damageTaken).toBeGreaterThan(0);
  });
});
