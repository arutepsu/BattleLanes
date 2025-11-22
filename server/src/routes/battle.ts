import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {

  // POST /battle/start
  app.post("/start", async (req, reply) => {
    return {
      matchId: crypto.randomUUID(),
      status: "started"
    };
  });

  // POST /battle/action
  app.post("/action", async (req: any) => {
    const { matchId, action, hero } = req.body;

    return {
      matchId,
      action,
      result: "ok",
      hero,
    };
  });
}
