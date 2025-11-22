import { FastifyInstance } from "fastify";
import {HERO_CATALOG} from "../data/domain/models/HeroCatalog";

export default async function (app: FastifyInstance) {
  // GET /heroes
  app.get("/", async () => {
    return HERO_CATALOG;
  });

  // GET /heroes/:id
  app.get("/:id", async (req: any, reply) => {
    const hero = HERO_CATALOG[req.params.id];
    if (!hero) return reply.code(404).send({ error: "Hero not found" });
    return hero;
  });
}
