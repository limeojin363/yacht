import { type ConnectionInfo } from ".";
import { getUser } from "../../auths/middleware";
import { PrismaClient } from ".prisma/client";

const disconnectHandler =
  ({ gameId, socket, userId }: ConnectionInfo) =>
  async () => {
    try {
      const { gameId: userGameId } = await getUser(userId);
      if (userGameId === null) return;

      socket.leave(String(gameId));
      socket.to(String(gameId)).emit("player-disconnected", { userId });

      const prismaClient = new PrismaClient();
      // 오류 / 강제종료 등으로 인한 비정상적인 연결 해제로 간주
      await prismaClient.user.update({
        where: { id: userId },
        data: {
          gameConnected: 0,
        },
      });
    } catch (error) {
        console.log("disconnect error", error);
        socket.leave(String(gameId));
        socket.disconnect();
    }
  };

  export default disconnectHandler;