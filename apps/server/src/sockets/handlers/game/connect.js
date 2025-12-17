import jwt from "jsonwebtoken";
import z from "zod";
import { getUser } from "../../../auths/middleware.js";
import { PrismaClient } from "../../../generated/client.js";
import generatePlayerColor from "../../../utils/color.js";
const gameConnectionHandler = async (socket) => {
    const authorization = socket.handshake.query["Authorization"];
    if (!authorization)
        throw new Error("No authorization header");
    // access token으로 접근 - 실패 시 refresh token으로 재시도 루틴
    const userId = (() => {
        try {
            const token = authorization.split(" ")[1];
            const decodedUserInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return SchemaOf.DecodedUserInfo.parse(decodedUserInfo).userId;
        }
        catch (error) {
            const refresh = socket.handshake.query["Refresh"];
            if (!refresh)
                throw new Error("No refresh token provided");
            const decodedRefresh = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
            return SchemaOf.DecodedUserInfo.parse(decodedRefresh).userId;
        }
    })();
    const gameId = (() => {
        const gameId = Number(socket.handshake.query["gameId"]);
        if (!gameId)
            throw new Error("No gameId given from client");
        return gameId;
    })();
    const user = await getUser(userId);
    // const game = await getGameInfo(gameId);
    const game = {};
    if (user.gameId && user.gameId !== gameId)
        throw new Error("User is already in another game");
    if (game.progressType === 2)
        throw new Error("Game has already ended");
    const prismaClient = new PrismaClient();
    // 신규 입장 유저
    if (user.gameId === null) {
        const gamePlayerId = await FromDB.generatePlayerId(gameId);
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
        const player = {
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
};
const SchemaOf = {
    DecodedUserInfo: z.object({
        userId: z.number(),
    }),
};
const FromDB = {
    generatePlayerId: async (gameId) => {
        const prismaClient = new PrismaClient();
        const game = {};
        const players = await prismaClient.user.findMany({
            where: { gameId },
            select: { gamePlayerId: true },
        });
        const usedPlayerIds = new Set(players.map((player) => {
            if (player.gamePlayerId === null)
                throw new Error("A player has null gamePlayerId");
            return player.gamePlayerId;
        }));
        const totalPlayersNum = game.gameStatus.scoreObjectList.length;
        for (let i = 0; i < totalPlayersNum; i++) {
            if (!usedPlayerIds.has(i))
                return i;
        }
        throw new Error("No available playerId");
    },
};
export default gameConnectionHandler;
