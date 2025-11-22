import Fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import cors from "@fastify/cors";

import heroesRoutes from "./routes/heroes";
import matchesRoutes from "./routes/matches";
// ... other imports

const app = Fastify({ logger: true });

const start = async () => {
  try {
    await app.register(cors, {
      origin: [
        "http://localhost:5173", // your Vite client
      ],
      methods: ["GET", "POST", "OPTIONS"],
    });

    // plugins
    app.register(websocketPlugin);

    // routes
    app.register(heroesRoutes, { prefix: "/heroes" });
    app.register(matchesRoutes, { prefix: "/matches" });
    // app.register(battleRoutes, { prefix: "/battle" });
    // app.register(battleSocket, { prefix: "/ws" });

    await app.listen({ port: 3000 });
    console.log("🚀 Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
