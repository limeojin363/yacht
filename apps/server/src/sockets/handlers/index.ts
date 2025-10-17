import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { getUser, getUserId } from "../../auths/middleware.js";
import z from "zod";
import { ProgressTypeSchema, type Player } from "@yacht/communications";
import {
  GameStatusSchema,
  PlayersNumSchema,
  type PlayerId,
} from "@yacht/default-game";
import generatePlayerColor from "../../utils/color.js";
import exitHandler from "./exit.js";
import gameInteractionHandler from "./game-interaction.js";
import gameStartHandler from "./game-start.js";
import disconnectHandler from "./disconnect.js";
import { PrismaClient } from "@prisma/client";

export const getGameInfo = async (gameId: number) => {
  const prismaClient = new PrismaClient();
  const gameRow = await prismaClient.game.findUnique({
    where: { id: gameId },
  });
  if (!gameRow) throw new Error("No game found");

  const gameStatus = GameStatusSchema.parse(
    JSON.parse(gameRow.gameStatus as string)
  );

  const gameToReturn = {
    id: gameRow.id,
    name: gameRow.name,
    gameStatus,
    progressType: gameRow.progressType,
    totalPlayersNum: gameStatus.scoreObjectList.length,
  };

  return SchemaOf.Game.parse(gameToReturn);
};

const onConnection = async (socket: Socket) => {
  let userId: number, gameId: number;

  try {
    ({ userId, gameId } = await _.getBaseInformations(socket));
  } catch (error) {
    console.error("Error on getting base informations: ", error);
    socket.emit("error-on-connection", { error, canRefresh: true });
    socket.disconnect();
    return;
  }

  try {
    _.processConnection({ gameId, userId, socket });
  } catch (error) {
    console.error("Error on processing connection: ", error);
    socket.disconnect();
    return;
  }

  const connectionInfo: ConnectionInfo = { userId, gameId, socket };

  socket.on("exit", exitHandler(connectionInfo));
  socket.on("disconnect", disconnectHandler(connectionInfo));
  socket.on("game-start", gameStartHandler(connectionInfo));
  socket.on("game-interaction", gameInteractionHandler(connectionInfo));
};

export type ConnectionInfo = {
  userId: number;
  gameId: number;
  socket: Socket;
};

const _ = {
  // 기본 정보(유저, 게임) 획득 및 검증
  getBaseInformations: async (socket: Socket) => {
    const authorization = socket.handshake.query["Authorization"] as string;
    if (!authorization) throw new Error("No authorization header");

    let userId: number;

    try {
      const token = authorization.split(" ")[1];
      const decodedInfo = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      ({ userId } = SchemaOf.DecodedInfo.parse(decodedInfo));
    } catch (error) {
      const refresh = socket.handshake.query["Refresh"] as string;
      if (!refresh) throw new Error("No refresh token provided");
      const decodedRefresh = jwt.verify(
        refresh,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      ({ userId } = SchemaOf.DecodedInfo.parse(decodedRefresh));
    }

    const user = await getUser(userId);

    const gameId = Number(socket.handshake.query["gameId"]);
    if (!gameId) throw new Error("No gameId given from client");

    // 유저가 게임에 등록되어 있고, 그 게임이 다른 게임임
    if (user.gameId && user.gameId !== gameId)
      throw new Error("User is already in another game");

    const game = await getGameInfo(gameId);

    if (game.progressType === 2) throw new Error("Game has already ended");

    return { userId, gameId };
  },
  // 연결 처리(DB에 입장정보 등록 및 socket client들에 전파)
  processConnection: async ({
    gameId,
    userId,
    socket,
  }: {
    gameId: number;
    userId: number;
    socket: Socket;
  }) => {
    const prismaClient = new PrismaClient();

    const user = await getUser(userId);

    // 신규 입장 유저
    if (user.gameId === null) {
      const gamePlayerId = await generatePlayerId(gameId);
      const gamePlayerColor = generatePlayerColor();
      const gameConnected = 1;

      await prismaClient.user.update({
        where: { id: user.id },
        data: {
          gameId,
          gamePlayerId,
          gamePlayerColor,
          gameConnected,
        },
      });

      const player: Player = {
        connected: gameConnected,
        playerColor: gamePlayerColor,
        playerId: gamePlayerId,
        userId: user.id,
        username: user.name,
      };

      socket.to(String(gameId)).emit("new-player", player);
    }
    // 기존 입장 유저
    else {
      const gameConnected = 1;

      await prismaClient.user.update({
        where: { id: user.id },
        data: { gameConnected },
      });

      socket.to(String(gameId)).emit("player-reconnected", { userId });
    }

    // 본인 소켓을 등록
    socket.join(String(gameId));

    const game = await getGameInfo(gameId);
    const playerList = await getPlayerList(gameId);

    // 현재 방 정보 전송
    socket.emit("current-room-info", {
      playerList,
      gameStatus: game.gameStatus,
      progressType: game.progressType,
    });
  },
};

export const getPlayerList = async (gameId: number) => {
  const prismaClient = new PrismaClient();

  const game = await getGameInfo(gameId);
  const totalPlayersNum = game.gameStatus.scoreObjectList.length;

  const users = await prismaClient.user.findMany({
    where: { gameId },
  });

  const playerList: (null | Player)[] = Array.from(
    { length: totalPlayersNum },
    () => null
  );

  for (const u of users) {
    playerList[u.gamePlayerId!] = {
      username: u.name,
      userId: u.id,
      playerColor: u.gamePlayerColor!,
      connected: u.gameConnected!,
      playerId: u.gamePlayerId as PlayerId,
    };
  }

  return playerList;
};

const generatePlayerId = async (gameId: number) => {
  const prismaClient = new PrismaClient();

  const game = await getGameInfo(gameId);

  const players = await prismaClient.user.findMany({
    where: { gameId },
    select: { gamePlayerId: true },
  });

  const usedPlayerIds = new Set(
    players.map((player) => {
      if (player.gamePlayerId === null)
        throw new Error("A player has null gamePlayerId");
      return player.gamePlayerId;
    })
  );

  const totalPlayersNum = game.gameStatus.scoreObjectList.length;

  for (let i = 0; i < totalPlayersNum; i++) {
    if (!usedPlayerIds.has(i)) return i as PlayerId;
  }

  throw new Error("No available playerId");
};

const SchemaOf = {
  Game: z.object({
    id: z.number(),
    name: z.string(),
    gameStatus: GameStatusSchema,
    progressType: ProgressTypeSchema,
    totalPlayersNum: PlayersNumSchema,
  }),
  DecodedInfo: z.object({
    userId: z.number(),
  }),
};

export default onConnection;
