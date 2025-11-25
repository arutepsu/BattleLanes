import type{
  MatchState,
  StepResult,
  HeroCatalog,
  PlayerSide,
  LaneId,
  HeroId,
} from "../types/game";

const BASE_URL = "http://localhost:3000";

async function getJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export async function fetchHeroes(): Promise<HeroCatalog> {
  return getJson<HeroCatalog>(`${BASE_URL}/heroes`);
}

export async function createMatch(
  leftPlayerId: string,
  rightPlayerId: string
): Promise<{ matchId: string; state: MatchState }> {
  return getJson(`${BASE_URL}/matches`, {
    method: "POST",
    body: JSON.stringify({ leftPlayerId, rightPlayerId }),
  });
}

export async function spawnUnit(
  matchId: string,
  playerSide: PlayerSide,
  lane: LaneId,
  heroId: HeroId
): Promise<{ ok: boolean; state: MatchState }> {
  return getJson(`${BASE_URL}/matches/${matchId}/spawn`, {
    method: "POST",
    body: JSON.stringify({ playerSide, lane, heroId }),
  });
}

export async function stepMatch(
  matchId: string,
  deltaMs: number
): Promise<StepResult> {
  return getJson(`${BASE_URL}/matches/${matchId}/step`, {
    method: "POST",
    body: JSON.stringify({ deltaMs }),
  });
}
