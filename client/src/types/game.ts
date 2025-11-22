// src/types/game.ts
export type PlayerSide = "left" | "right";
export type LaneId = 0 | 1 | 2;

export interface TowerState {
  hp: number;
  maxHp: number;
}

export interface PlayerState {
  id: string;
  side: PlayerSide;
  mana: number;
  maxMana: number;
  manaRegenPerSecond: number;
  tower: TowerState;
}

export type HeroId = string;

export interface UnitState {
  id: string;
  heroId: HeroId;
  side: PlayerSide;
  lane: LaneId;
  x: number;            // 0..1 along lane
  hp: number;
  maxHp: number;
  attack: number;
  range: number;
  speed: number;
  attackCooldownMs: number;
  lastAttackAt: number;
}

export interface MatchState {
  id: string;
  createdAt: number;
  lastUpdatedAt: number;
  players: Record<PlayerSide, PlayerState>;
  units: UnitState[];
  isFinished: boolean;
  winnerSide?: PlayerSide;
}

// ---- Events from /step ----

export type GameEvent =
  | {
      type: "unitDamaged";
      unitId: string;
      heroId: HeroId;
      lane: LaneId;
      side: PlayerSide;
      amount: number;
      hpAfter: number;
    }
  | {
      type: "unitDied";
      unitId: string;
      heroId: HeroId;
      lane: LaneId;
      side: PlayerSide;
    }
  | {
      type: "towerDamaged";
      towerSide: PlayerSide;
      amount: number;
      hpAfter: number;
    }
  | {
      type: "towerDestroyed";
      towerSide: PlayerSide;
      winnerSide: PlayerSide;
    }
  | {
      type: "matchFinished";
      winnerSide: PlayerSide;
    };

export interface StepResult {
  state: MatchState;
  events: GameEvent[];
}

// ---- Heroes from /heroes ----

export interface AnimConfig {
  spriteSheetSrc: string;
  frameWidth: number;
  frameHeight: number;
  framesPerRow: number;
  totalFrames: number;
  fps: number;
  scale: number;
  startFrame: number;
  loop: boolean;
  backgroundColor: string | null;
}

export interface HeroAnimations {
  idle: AnimConfig;
  walk: AnimConfig;
  attack: AnimConfig | AnimConfig[];
  hit: AnimConfig;
  dead: AnimConfig;
}

export interface HeroDefinition {
  type: string;
  name: string;
  maxHp: number;
  attack: number;
  range: number;
  speed: number;
  cost: number;
  attackCooldownMs: number;
  animations: HeroAnimations;
}

export type HeroCatalog = Record<HeroId, HeroDefinition>;
