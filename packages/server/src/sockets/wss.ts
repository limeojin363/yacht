import {
  Game,
  GameStatus,
  PlayerActionName,
  PlayerActionPayloadTypes,
  RenderUnitUpdateAction,
} from "common/default-game";
import { pool, server } from "..";
import verifyAuthHeader from "../auths/verifyUser";
import { Server } from "socket.io";
import z from "zod";
import { GameStatusSchema } from "../schema/GameStatus";

// TODO: 소켓 관련 공용 코드 common 프로젝트로 분리하기
interface ServerToClientEvents {
  authenticated: () => void;
  "render-unit-update": (updateActions: RenderUnitUpdateAction[]) => void;
  "new-user-entered": () => void;
  "user-exited": () => void;
}

interface ClientToServerEvents {
  "enter-game": (gameId: number) => void;
  "user-interaction": <P extends PlayerActionName>({
    type,
    payload,
  }: {
    type: P;
    payload: PlayerActionPayloadTypes[P];
  }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);
const gameIo = io.of("/game");

gameIo.on("connection", async (socket) => {
  try {
    const {
      authority_level,
      id: userId,
      g_connected,
      password,
      salt,
      username,
    } = await verifyAuthHeader(socket.handshake.headers["authorization"]);

    const referer = socket.request.headers.referer;
    if (!referer) throw new Error("No referer");
    const gameId = Number(
      referer.split("/")[referer.split("/").length - 1].replace(/\?.+/, "")
    );

    socket.join(`${gameId}`);
    const currentRoom = socket.to(`${gameId}`);

    // 인증이 완료되었다고 클라이언트에 전달
    currentRoom.emit("authenticated");

    socket.on("disconnect", (e) => {
      socket.leave(`${gameId}`);
      currentRoom.emit("user-exited");
    });

    // DB에 게임 + 유저 관계 생성
    // 소켓 연결에 해당 관계 바인딩
    currentRoom.emit("new-user-entered");

    // 게임 상호작용(클릭)
    socket.on("user-interaction", async ({ payload, type }) => {
      const gameStatus = await FromDB.getGameStatus(gameId);

      const updateActions = Game.getUpdateActionsFromPlayerAction(
        type,
        payload,
        gameStatus
      );

      // 상호작용 결과를 DB에 반영
      await FromDB.setGameStatus(gameId, Game.dispatch(updateActions, gameStatus));
      // 상호작용 결과를 클라이언트에 전파
      currentRoom.emit("render-unit-update", updateActions);
    });
  } catch (error) {
    console.log(error);
    socket.disconnect();
  }
});

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

    return parseResult.data[0].gameObject;
  },
  setGameStatus: async (gameId: number, gameStatus: GameStatus) => {
    await pool.query("UPDATE games SET gameObject = ? WHERE id = ?", [
      gameStatus,
      gameId,
    ]);
  },
};
