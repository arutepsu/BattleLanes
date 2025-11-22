// src/services/matchService.ts
import { MatchState, PlayerSide, LaneId, UnitState, StepResult, GameEvent } from "../domain/models/GameTypes";
import {HERO_CATALOG, HeroId } from "../domain/models/HeroCatalog";
import crypto from "crypto";
// In-memory storage for now
// src/services/matchService.ts

// In-memory matches
const matches = new Map<string, MatchState>();

// We treat lane as [0, 1]
// left tower at 0, right tower at 1
const TOWER_POSITION_LEFT = 0;
const TOWER_POSITION_RIGHT = 1;

function nowMs(): number {
  return Date.now();
}

function baseTower(): { hp: number; maxHp: number } {
  return { hp: 500, maxHp: 500 };
}

// ----------------- Match creation & access -----------------

function createMatch(leftPlayerId: string, rightPlayerId: string): MatchState {
  const id = crypto.randomUUID();
  const now = nowMs();

    const match: MatchState = {
    id,
    createdAt: now,
    lastUpdatedAt: now,
    players: {
        left: {
        id: leftPlayerId,
        side: "left",
        mana: 3,
        maxMana: 10,
        manaRegenPerSecond: 1,
        tower: { hp: 500, maxHp: 500 },
        },
        right: {
        id: rightPlayerId,
        side: "right",
        mana: 3,
        maxMana: 10,
        manaRegenPerSecond: 1,
        tower: { hp: 500, maxHp: 500 },
        },
    },
    units: [], // always an array, even if empty
    isFinished: false,
    };


  matches.set(id, match);
  return match;
}

function getMatch(id: string): MatchState | undefined {
  return matches.get(id);
}

// ----------------- Spawn unit -----------------

function spawnUnit(
  match: MatchState,
  playerSide: PlayerSide,
  lane: LaneId,
  heroId: HeroId
): MatchState {
  const player = match.players[playerSide];
  const hero = HERO_CATALOG[heroId];

  if (!hero) throw new Error("Unknown hero: " + heroId);
  if (!player) throw new Error("Unknown player side");

  if (player.mana < hero.cost) {
    throw new Error("Not enough mana");
  }

  // consume mana
  player.mana -= hero.cost;

  // 🔧 Range & speed tuning:
  // - lane is [0,1]
  // - hero.range (1..4-ish) → fraction of lane
  // - hero.speed (15..30-ish) → fraction of lane per second
  const RANGE_SCALE = 0.1;   // 0.1 lane per "range point"
  const SPEED_SCALE = 1 / 100; // hero.speed 25 → 0.25 lane/sec

  const unit: UnitState = {
    id: crypto.randomUUID(),
    heroId,
    side: playerSide,
    lane,
    x: playerSide === "left" ? TOWER_POSITION_LEFT : TOWER_POSITION_RIGHT,
    hp: hero.maxHp,
    maxHp: hero.maxHp,
    attack: hero.attack,
    range: hero.range * RANGE_SCALE,
    speed: hero.speed * SPEED_SCALE,
    attackCooldownMs: hero.attackCooldownMs,
    lastAttackAt: 0,
  };

  match.units.push(unit);
  match.lastUpdatedAt = nowMs();
  return match;
}

// ----------------- Helpers -----------------

function unitDistance(a: UnitState, b: UnitState): number {
  return Math.abs(a.x - b.x);
}

function towerX(side: PlayerSide): number {
  return side === "left" ? TOWER_POSITION_LEFT : TOWER_POSITION_RIGHT;
}

function oppositeSide(side: PlayerSide): PlayerSide {
  return side === "left" ? "right" : "left";
}

function findEnemyInRange(unit: UnitState, enemies: UnitState[]): UnitState | undefined {
  let best: UnitState | undefined;
  let bestDist = Infinity;

  for (const e of enemies) {
    if (e.lane !== unit.lane) continue;
    const dist = unitDistance(unit, e);
    if (dist <= unit.range && dist < bestDist) {
      best = e;
      bestDist = dist;
    }
  }

  return best;
}

function canAttack(now: number, unit: UnitState): boolean {
  return now - unit.lastAttackAt >= unit.attackCooldownMs;
}

// ----------------- Core simulation: stepMatch -----------------

function stepMatch(match: MatchState, deltaMs: number): StepResult {
  const events: GameEvent[] = [];

  if (match.isFinished) {
    return { state: match, events };
  }

  const now = nowMs();
  const deltaSec = deltaMs / 1000;

  // 1) mana regen
  (["left", "right"] as PlayerSide[]).forEach((side) => {
    const p = match.players[side];
    p.mana = Math.min(p.maxMana, p.mana + p.manaRegenPerSecond * deltaSec);
  });

  // 2) movement
  for (const unit of match.units) {
    const direction = unit.side === "left" ? +1 : -1;
    // speed is lane fraction per second -> multiply by deltaSec
    unit.x += direction * unit.speed * deltaSec;

    // clamp to [0,1]
    if (unit.x < 0) unit.x = 0;
    if (unit.x > 1) unit.x = 1;
  }

  // 3) combat
  const leftUnits = match.units.filter((u) => u.side === "left");
  const rightUnits = match.units.filter((u) => u.side === "right");

  const deadUnitIds = new Set<string>();

  for (const unit of match.units) {
    if (deadUnitIds.has(unit.id)) continue;

    const enemySide = oppositeSide(unit.side);
    const enemies = enemySide === "left" ? leftUnits : rightUnits;

    if (!canAttack(now, unit)) {
      continue;
    }

    // 3a) try enemy units
    const enemyInRange = findEnemyInRange(unit, enemies);

    if (enemyInRange) {
      enemyInRange.hp -= unit.attack;
      unit.lastAttackAt = now;

      events.push({
        type: "unitDamaged",
        unitId: enemyInRange.id,
        heroId: enemyInRange.heroId,
        lane: enemyInRange.lane,
        side: enemyInRange.side,
        amount: unit.attack,
        hpAfter: Math.max(0, enemyInRange.hp),
      });

      if (enemyInRange.hp <= 0) {
        deadUnitIds.add(enemyInRange.id);
        events.push({
          type: "unitDied",
          unitId: enemyInRange.id,
          heroId: enemyInRange.heroId,
          lane: enemyInRange.lane,
          side: enemyInRange.side,
        });
      }

      continue;
    }

    // 3b) try enemy tower
    const enemyTower = match.players[enemySide].tower;
    const enemyTowerPos = towerX(enemySide);
    const distToTower = Math.abs(unit.x - enemyTowerPos);

    if (distToTower <= unit.range && enemyTower.hp > 0) {
      enemyTower.hp -= unit.attack;
      if (enemyTower.hp < 0) enemyTower.hp = 0;
      unit.lastAttackAt = now;

      events.push({
        type: "towerDamaged",
        towerSide: enemySide,
        amount: unit.attack,
        hpAfter: enemyTower.hp,
      });

      if (enemyTower.hp <= 0) {
        match.isFinished = true;
        match.winnerSide = unit.side;

        events.push({
          type: "towerDestroyed",
          towerSide: enemySide,
          winnerSide: unit.side,
        });

        events.push({
          type: "matchFinished",
          winnerSide: unit.side,
        });
      }
    }
  }

  // 4) remove dead units
  if (deadUnitIds.size > 0) {
    match.units = match.units.filter((u) => !deadUnitIds.has(u.id));
  }

  match.lastUpdatedAt = now;
  return { state: match, events };
}

export const MatchService = {
  createMatch,
  getMatch,
  spawnUnit,
  stepMatch,
};
