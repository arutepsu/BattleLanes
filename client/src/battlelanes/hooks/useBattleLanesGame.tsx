import { useCallback, useEffect, useState } from "react";
import type {
  MatchState,
  HeroCatalog,
  HeroId,
  PlayerSide,
  LaneId,
} from "../../types/game";
import {
  fetchHeroes,
  createMatch,
  spawnUnit,
  stepMatch,
} from "../../api/gameApi";

const TICK_MS = 100;

export function useBattleLanesGame() {
  const [heroCatalog, setHeroCatalog] = useState<HeroCatalog | null>(null);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [activeSide, setActiveSide] = useState<PlayerSide>("left");

  // init: load heroes + create match
  useEffect(() => {
    (async () => {
      try {
        const heroes = await fetchHeroes();
        setHeroCatalog(heroes);

        const { matchId, state } = await createMatch("Player1", "Player2");
        setMatchId(matchId);
        setMatch(state);
      } catch (err) {
        console.error("Error initializing game:", err);
      }
    })();
  }, []);

  // game loop
  useEffect(() => {
    if (!matchId || !isRunning) return;

    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      try {
        const { state /*, events */ } = await stepMatch(matchId, TICK_MS);
        setMatch({ ...state });
      } catch (err) {
        console.error(err);
      }
      if (!cancelled) {
        setTimeout(run, TICK_MS);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [matchId, isRunning]);

  const handleSpawn = useCallback(
    async (lane: LaneId) => {
      if (!matchId || !selectedHeroId) return;
      try {
        const res = await spawnUnit(matchId, activeSide, lane, selectedHeroId);
        setMatch(res.state);
      } catch (err) {
        console.error("Spawn error:", err);
      }
    },
    [matchId, selectedHeroId, activeSide]
  );

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  return {
    heroCatalog,
    match,
    matchId,
    selectedHeroId,
    setSelectedHeroId,
    activeSide,
    setActiveSide,
    isRunning,
    toggleRunning,
    handleSpawn,
  };
}
