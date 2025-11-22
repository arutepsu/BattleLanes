import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {

  app.get("/battle", { websocket: true }, (connection, req) => {
    console.log("Player connected!");

    connection.socket.on("message", (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "join") {
        connection.socket.send(JSON.stringify({
          type: "welcome",
          msg: "You joined the battle server"
        }));
      }

      if (data.type === "attack") {
        connection.socket.send(JSON.stringify({
          type: "attack-result",
          result: "hit",
          damage: 21,
        }));
      }
    });
  });
}
