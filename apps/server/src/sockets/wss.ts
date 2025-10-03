import {
  GameStatusSchema,
  getUpdatedGameStatus,
  type GameStatus,
  type TotalPlayersNum,
} from "@yacht/default-game";
import { expressServer, pool } from "../index";
import verifyAuthHeader from "../auths/verifyUser.js";
import z from "zod";
import { Server } from "socket.io";
import generateRandomHexColor from "../utils/color";

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

  const gameNsp = io.of("/game");

  gameNsp.on("connection", async (socket) => {
    let userId: number,
      username: string,
      gameId: number,
      totalPlayers: TotalPlayersNum,
      g_playerId: number | null,
      g_playerColor: string | null;
    try {
      let g_id: number | null;
      ({
        id: userId,
        username,
        g_id,
        g_playerId,
        g_playerColor,
      } = await verifyAuthHeader(
        socket.handshake.query["Authorization"] as string
      ));
      console.log({ g_id });
      gameId = Number(socket.handshake.query["gameId"] as string);

      // 게임 ID가 유효하지 않음
      if (!gameId) throw new Error("No gameId given from client");
      // 유저가 게임에 등록되어 있고, 그 게임이 다른 게임임
      if (g_id !== null && g_id !== gameId)
        throw new Error("User is already in another game");

      ({ totalPlayers } = await FromDB.getGameStatus(gameId));

      // 아직 등록되지 않은 유저(신규 입장)
      if (g_id === null) {
        g_id = gameId;
        // DB의 게임 정보로부터 playerId 생성
        g_playerId = await FromDB.generatePlayerId(gameId, totalPlayers);
        g_playerColor = generateRandomHexColor();

        // DB에 등록
        await FromDB.setUser({
          g_playerColor,
          g_id,
          g_playerId,
          userId,
          g_connected: 1,
        });

        // 해당 방에 접속한 클라이언트들에게 새 유저 입장 알림
        socket.to(String(gameId)).emit("new-player-entered", {
          username,
          g_playerId,
          g_playerColor,
          userId,
          g_connected: 1,
        });
      }
      // 이미 등록된 유저(재접속)
      else {
        await FromDB.setUser({
          g_playerColor,
          g_id,
          g_playerId,
          userId,
          g_connected: 1,
        });

        socket.to(String(gameId)).emit("player-reconnected", userId);
      }

      // 소켓을 gameId에 해당되는 room에 등록
      socket.join(String(gameId));
      // 기존 방 정보를 클라이언트에 전파
      socket.emit("current-players", await FromDB.getCurrentPlayers(gameId));

      // exit -> DB에서 제거 후 disconnect
      socket.on("exit", async () => {
        console.log("exit received", { g_id, userId });
        // 소켓 방에서 제거
        socket.leave(String(gameId));
        // DB에서 제거
        await FromDB.setUser({
          userId,
          g_id: null,
          g_playerId: null,
          g_playerColor: null,
          g_connected: 0,
        });
        // 유저 퇴장 알림
        socket.to(String(gameId)).emit("player-exited", userId);
        socket.disconnect();
      });

      // disconnect - 오류 등으로 우연히 끊긴 것으로 간주하고 방에서만 제거(DB 유지 및 재접속 대기)
      socket.on("disconnect", async () => {
        const { g_id } = await verifyAuthHeader(
          socket.handshake.query["Authorization"] as string
        );
        // 이미 exit 수행됨
        if (g_id === null) return;

        // 소켓 방에서 제거
        socket.leave(String(gameId));
        // DB에서 연결 끊김 처리
        await FromDB.setUser({
          userId,
          g_id,
          g_playerId,
          g_playerColor,
          g_connected: 0,
        });
        // 유저 연결 끊김 알림
        socket.to(String(gameId)).emit("player-disconnected", userId);
      });
    } catch (error) {
      console.log(error);
      socket.send(error);
      socket.disconnect();
      return;
    }
  });
};

const SchemaOf = {
  GameRows: z.array(
    z.object({
      id: z.number(),
      game_object: GameStatusSchema,
      progress_type: z.number(),
    })
  ),
  PlayerRows: z.array(
    z.object({
      username: z.string(),
      g_playerId: z.number(),
      g_playerColor: z.string().nullable(),
      userId: z.number(),
      g_connected: z.number(),
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

    return parseResult.data[0]!.game_object;
  },
  generatePlayerId: async (gameId: number, totalPlayers: number) => {
    const [rows] = await pool.query(
      "SELECT username, g_playerId, g_playerColor, id AS userId, g_connected FROM users WHERE g_id = ?",
      [gameId]
    );
    console.log(rows);
    const parsedPlayers = SchemaOf.PlayerRows.parse(rows);
    const takenIds = parsedPlayers.map((p) => p.g_playerId);
    for (let i = 0; i < totalPlayers; i++) {
      if (!takenIds.includes(i)) return i;
    }
    throw new Error("No available player IDs");
  },
  getCurrentPlayers: async (gameId: number) => {
    const [rows] = await pool.query(
      "SELECT username, g_playerId, g_playerColor, g_connected, id AS userId FROM users WHERE g_id = ?",
      [gameId]
    );
    const parsedPlayers = SchemaOf.PlayerRows.parse(rows);
    return parsedPlayers;
  },
  setGameStatus: async (gameId: number, gameStatus: GameStatus) => {
    await pool.query("UPDATE games SET gameObject = ? WHERE id = ?", [
      gameStatus,
      gameId,
    ]);
  },
  setUser: async ({
    g_playerColor,
    g_connected,
    g_id,
    g_playerId,
    userId,
  }: {
    g_playerColor: string | null;
    g_connected: number;
    g_id: number | null;
    g_playerId: number | null;
    userId: number;
  }) => {
    const res = await pool.query(
      "UPDATE users SET g_playerColor = ?, g_connected = ?, g_id = ?, g_playerId = ? WHERE id = ?",
      [g_playerColor, g_connected, g_id, g_playerId, userId]
    );

    console.log({ res });
  },
};
