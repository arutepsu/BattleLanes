// src/api/gameApi.ts
import type {
  HeroCatalog,
  MatchState,
  HeroId,
  PlayerSide,
  LaneId,
} from "../types/game";

/**
 * Base URL for the backend.
 * If your Fastify app listens on http://localhost:3000
 * and matches routes are registered with prefix "/matches",
 * then this is correct.
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/** Response shape for createMatch */
export interface CreateMatchResponse {
  matchId: string;
  state: MatchState;
}

/** Response shape for spawnUnit */
export interface SpawnUnitResponse {
  ok?: boolean;     // backend returns { ok: true, state: ... }
  state: MatchState;
}

/** Response shape for stepMatch */
export interface StepMatchResponse {
  state: MatchState;
  events?: unknown[]; // or your GameEvent[] type
}

/**
 * Load all heroes + stats + animation configs.
 * GET /heroes
 *
 * (Make sure you have a Fastify route for GET /heroes!)
 */
export async function fetchHeroes(): Promise<HeroCatalog> {
  const res = await fetch(`${API_BASE}/heroes`);

  if (!res.ok) {
    throw new Error(`fetchHeroes failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Create a new match between two players.
 *
 * Backend route (Fastify):
 *   app.post("/", async (req, reply) => {
 *     const body = req.body as { leftPlayerId: string; rightPlayerId: string };
 *     const match = MatchService.createMatch(body.leftPlayerId, body.rightPlayerId);
 *     return { matchId: match.id, state: match };
 *   });
 *
 * If this route is registered with prefix "/matches",
 * the final URL is POST http://localhost:3000/matches
 */
export async function createMatch(
  leftName: string,
  rightName: string
): Promise<CreateMatchResponse> {
  const res = await fetch(`${API_BASE}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // IMPORTANT: backend expects leftPlayerId / rightPlayerId
    body: JSON.stringify({ leftPlayerId: leftName, rightPlayerId: rightName }),
  });

  if (!res.ok) {
    throw new Error(`createMatch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Spawn a unit on a lane for a given side.
 *
 * Backend:
 *   app.post("/:matchId/spawn", async (req, reply) => {
 *     const body = req.body as {
 *       playerSide: PlayerSide;
 *       lane: LaneId;
 *       heroId: HeroId;
 *     };
 *     ...
 *     return { ok: true, state: updated };
 *   });
 */
export async function spawnUnit(
  matchId: string,
  side: PlayerSide,
  lane: LaneId,
  heroId: HeroId
): Promise<SpawnUnitResponse> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/spawn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // IMPORTANT: backend expects playerSide, not side
    body: JSON.stringify({ playerSide: side, lane, heroId }),
  });

  if (!res.ok) {
    throw new Error(`spawnUnit failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Advance the simulation by tickMs.
 *
 * Backend:
 *   app.post("/:matchId/step", async (req, reply) => {
 *     const body = req.body as { deltaMs?: number };
 *     const { state, events } = MatchService.stepMatch(match, body.deltaMs ?? 100);
 *     return { state, events };
 *   });
 */
export async function stepMatch(
  matchId: string,
  tickMs: number
): Promise<StepMatchResponse> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // IMPORTANT: backend expects deltaMs, not tickMs
    body: JSON.stringify({ deltaMs: tickMs }),
  });

  if (!res.ok) {
    throw new Error(`stepMatch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
