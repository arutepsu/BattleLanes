// src/types/game.ts
import { HeroId } from "./HeroCatalog";

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

export interface UnitState {
  id: string;
  heroId: HeroId;
  side: PlayerSide;     // who owns this unit
  lane: LaneId;
  x: number;            // 0 = own tower, 1 = enemy tower
  hp: number;
  maxHp: number;
  attack: number;
  range: number;        // fraction of lane (0..1)
  speed: number;        // lane fraction per second
  attackCooldownMs: number;
  lastAttackAt: number; // timestamp (ms) of last attack
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

// ---- Events for sexy UI ----

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

// What stepMatch will return:
export interface StepResult {
  state: MatchState;
  events: GameEvent[];
}