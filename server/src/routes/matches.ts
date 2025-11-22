// src/routes/matches.ts
import { FastifyInstance } from "fastify";
import { MatchService } from "../data/services/matchService";
import { PlayerSide, LaneId } from "../data/domain/models/GameTypes";
import { HeroId } from "../data/domain/models/HeroCatalog";

export default async function (app: FastifyInstance) {
  app.post("/",
    async (req, reply) => {
      const body = req.body as { leftPlayerId: string; rightPlayerId: string };
      const match = MatchService.createMatch(body.leftPlayerId, body.rightPlayerId);
      return { matchId: match.id, state: match };
    }
  );

  app.get("/:matchId", async (req, reply) => {
    const { matchId } = req.params as { matchId: string };
    const match = MatchService.getMatch(matchId);
    if (!match) return reply.code(404).send({ error: "Match not found" });
    return match;
  });

  app.post("/:matchId/spawn", async (req, reply) => {
    const { matchId } = req.params as { matchId: string };
    const body = req.body as {
      playerSide: PlayerSide;
      lane: LaneId;
      heroId: HeroId;
    };

    const match = MatchService.getMatch(matchId);
    if (!match) return reply.code(404).send({ error: "Match not found" });

    try {
      const updated = MatchService.spawnUnit(match, body.playerSide, body.lane, body.heroId);
      return { ok: true, state: updated };
    } catch (e: any) {
      return reply.code(400).send({ error: e.message });
    }
  });

  app.post("/:matchId/step", async (req, reply) => {
    const { matchId } = req.params as { matchId: string };
    const body = req.body as { deltaMs?: number };

    const match = MatchService.getMatch(matchId);
    if (!match) return reply.code(404).send({ error: "Match not found" });

    const { state, events } = MatchService.stepMatch(match, body.deltaMs ?? 100);

    return { state, events };
  });
  
}
