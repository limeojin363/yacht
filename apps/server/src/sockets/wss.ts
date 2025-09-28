import { GameStatusSchema, type GameStatus } from "@yacht/default-game";
import { expressServer, pool } from "../index";
import verifyAuthHeader from "../auths/verifyUser.js";
import z from "zod";
import { Server } from "socket.io";

export const wss = () => {
  const io = new Server(expressServer, {
    cors: {
      origin: [
        "https://shiny-space-capybara-q5v4qxjx6vx3x75g-5173.app.github.dev",
      ],
      methods: ["GET", "POST"],
    },
  });
  console.log("WSS module loaded");

  const gameIo = io.of("/game");

  gameIo.on("connection", async (socket) => {
    console.log(socket.handshake.query["Authorization"]);
    try {
      const {
        authority_level,
        id: userId,
        g_connected,
        password,
        salt,
        username,
      } = await verifyAuthHeader(
        socket.handshake.query["Authorization"] as any
      );

      const gameId = Number(socket.handshake.query["gameId"] as string);
      if (!gameId) throw new Error("No referer");

      socket.join(`${gameId}`);
      const currentGame = gameIo.to(`${gameId}`);

      // 인증이 완료되었다고 클라이언트에 전달
      socket.emit("authenticated");

      socket.on("disconnect", (e) => {
        socket.leave(`${gameId}`);
        currentGame.emit("user-exited");
      });

      // DB에 게임 + 유저 관계 생성
      // 소켓 연결에 해당 관계 바인딩
      currentGame.emit("new-user-entered");

      // 게임 상호작용(클릭)
      socket.on("user-interaction", async ({ payload, type }) => {
        const gameStatus = await FromDB.getGameStatus(gameId);
      });
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }
  });
};

const SchemaOf = {
  GameRows: z.array(
    z.object({
      id: z.number(),
      gameObject: GameStatusSchema,
      inProgress: z.number().min(0).max(1),
    })
  ),
};

const FromDB = {
  getGameStatus: async (gameId: number): Promise<GameStatus> => {
    const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [
      gameId,
    ]);
    const parseResult = SchemaOf.GameRows.safeParse(rows);
    if (!parseResult.success) throw new Error("Invalid game status");

    return parseResult.data[0]!.gameObject;
  },
  setGameStatus: async (gameId: number, gameStatus: GameStatus) => {
    await pool.query("UPDATE games SET gameObject = ? WHERE id = ?", [
      gameStatus,
      gameId,
    ]);
  },
};
