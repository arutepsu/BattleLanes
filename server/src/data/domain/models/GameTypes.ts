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
export type UnitPhase = "walking" | "attackingUnit" | "attackingTower" | "dead";

export interface UnitState {
  id: string;
  heroId: HeroId;
  side: PlayerSide;
  lane: LaneId;

  x: number;

  hp: number;
  maxHp: number;
  attack: number;
  range: number;
  speed: number;

  attackCooldownMs: number;
  lastAttackAt: number;

  phase: UnitPhase;
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