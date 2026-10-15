import type { CharacterId, Difficulty, MissionId } from '@/content/ids';
import type { GameEngine } from '@/core/engine/engine-types';
import { DuelEngine } from '@/engines/duel/duel-engine';
import { OpenFieldEngine } from '@/engines/open-field/open-field-engine';
import { QuestEngine } from '@/engines/quest/quest-engine';
import { MISSIONS_BY_ID } from './catalog';
import { MISSION_CONFIGS, trainingConfig, type MissionConfig } from './configs';

export interface CreateEngineOptions {
  difficulty: Difficulty;
  playerName: string;
  seed?: number;
  training?: { player: CharacterId; opponent: CharacterId; mounted: boolean };
}

export function missionConfig(id: MissionId, training?: CreateEngineOptions['training']): MissionConfig {
  if (id === 'm07') {
    const t = training ?? { player: 'white-knight', opponent: 'red-paladin', mounted: false };
    return trainingConfig(t.player, t.opponent, t.mounted);
  }
  return MISSION_CONFIGS[id];
}

/** Instantiate the right engine for a mission. Engines validate their config on construction. */
export function createEngine(id: MissionId, opts: CreateEngineOptions): GameEngine {
  const meta = MISSIONS_BY_ID[id];
  const init = {
    difficulty: opts.difficulty,
    seed: opts.seed ?? (Date.now() & 0x7fffffff),
    missionLabel: `Mission ${meta.number} · ${meta.title}`,
    playerName: opts.playerName,
  };
  const mc = missionConfig(id, opts.training);
  switch (mc.engine) {
    case 'duel':
      return new DuelEngine(mc.config, init);
    case 'quest':
      return new QuestEngine(mc.config, init);
    case 'open-field':
      return new OpenFieldEngine(mc.config, init);
  }
}
