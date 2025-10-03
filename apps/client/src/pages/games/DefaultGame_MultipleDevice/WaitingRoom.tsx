import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const socketUrl =
  "wss://shiny-space-capybara-q5v4qxjx6vx3x75g-3000.app.github.dev";

const getAuthorizationHeader = () =>
  `Bearer ${JSON.parse(localStorage.getItem("accessToken") || "")}`;

const getSocket = (gameId: number) => {
  return io(`${socketUrl}/game`, {
    query: {
      Authorization: getAuthorizationHeader(),
      gameId,
    },
    autoConnect: false,
  });
};

const useRoomInfo = (gameId: number) => {
  const navigate = useNavigate();
  const socket = useMemo(() => getSocket(gameId), [gameId]);
  const [currentRoomInfo, setCurrentRoomInfo] = useState<{
    playerList: (null | {
      username: string;
      userId: number;
      playerColor: string | null;
      connected: number;
    })[];
  }>();

  useEffect(() => {
    socket.connect();

    socket.on("ping", (d) => {
      console.log("ping received", d);
    });

    socket.on("current-room-info", (currentRoomInfoData) => {
      console.log("current-room-info", currentRoomInfoData);
      setCurrentRoomInfo(currentRoomInfoData);
    });

    socket.on("new-player-entered", (newUserData) => {
      console.log("new-player-entered", newUserData);
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        const nextPlayerList = [...prev.playerList];
        nextPlayerList[newUserData.g_playerId] = {
          username: newUserData.username,
          userId: newUserData.userId,
          playerColor: newUserData.g_playerColor,
          connected: newUserData.g_connected,
        };
        return { ...prev, playerList: nextPlayerList };
      });
    });

    socket.on("player-exited", (userId) => {
      console.log("player-exited", userId);
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        const nextPlayerList = [...prev.playerList];
        const index = nextPlayerList.findIndex((user) => {
          if (!user) return false;
          return user.userId === userId;
        });
        if (index !== -1) nextPlayerList[index] = null;
        return { ...prev, playerList: nextPlayerList };
      });
    });

    socket.on("player-disconnected", (userId) => {
      console.log("player-disconnected", userId);
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        return {
          ...prev,
          playerList: prev.playerList.map((user) => {
            if (!user) return user;
            return user.userId === userId ? { ...user, connected: 0 } : user;
          }),
        };
      });
    });

    socket.on("player-reconnected", (userId) => {
      console.log("player-reconnected", userId);
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        return {
          ...prev,
          playerList: prev.playerList.map((user) => {
            if (!user) return user;
            return user.userId === userId ? { ...user, connected: 1 } : user;
          }),
        };
      });
    });

    return () => {
      socket.removeAllListeners();
      if (socket.active) socket.disconnect();
    };
  }, [socket, navigate]);

  const exit = () => {
    if (socket.active) socket.emit("exit");
    navigate({ to: "/multiple-device/default-game" });
  };

  return { ...currentRoomInfo, exit };
};

const UserList = ({ gameId }: { gameId: number }) => {
  const { playerList, exit } = useRoomInfo(gameId);

  const isConnected = !!playerList;
  if (!isConnected) return <div>Loading...</div>;

  return (
    <>
      <button onClick={exit}>나가기</button>
      {playerList.map((user) => (
        <>
          {user ? (
            <li key={user.userId} onClick={() => console.log(user)}>
              {user.username} - {user.connected ? "온라인" : "오프라인"}
            </li>
          ) : (
            "null"
          )}
        </>
      ))}
    </>
  );
};

const WaitingRoom = ({ gameId }: { gameId: number }) => {
  return (
    <S.Root>
      <h1>대기실</h1>
      <UserList gameId={gameId} />
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
};

export default WaitingRoom;
