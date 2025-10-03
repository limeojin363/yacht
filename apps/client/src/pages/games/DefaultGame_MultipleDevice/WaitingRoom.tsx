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
  const socket = useMemo(() => getSocket(gameId), [gameId]);
  const navigate = useNavigate();
  const [playerList, setPlayerList] = useState<
    {
      username: string;
      userId: number;
      g_playerId: number;
      g_playerColor: string | null;
      g_connected: number;
    }[]
  >();

  useEffect(() => {
    socket.connect();

    socket.on("ping", (d) => {
      console.log("ping received", d);
    });

    socket.on("current-players", (playerListData) => {
      console.log("current-players", playerListData);
      setPlayerList(playerListData);
    });

    socket.on("new-player-entered", (newUserData) => {
      console.log("new-player-entered", newUserData);
      setPlayerList((prev) => {
        if (!prev) return;
        return [...prev, newUserData];
      });
    });

    socket.on("player-exited", (userId) => {
      console.log("player-exited", userId);
      setPlayerList((prev) => prev?.filter((user) => user.userId !== userId));
    });

    socket.on("player-disconnected", (userId) => {
      console.log("player-disconnected", userId);
      setPlayerList((prev) =>
        prev?.map((user) =>
          user.userId === userId ? { ...user, g_connected: 0 } : user
        )
      );
    });

    socket.on("player-reconnected", (userId) => {
      console.log("player-reconnected", userId);
      setPlayerList((prev) =>
        prev?.map((user) =>
          user.userId === userId ? { ...user, g_connected: 1 } : user
        )
      );
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

  return { playerList, exit };
};

const UserList = ({ gameId }: { gameId: number }) => {
  const { playerList, exit } = useRoomInfo(gameId);

  const isConnected = !!playerList;
  if (!isConnected) return <div>Loading...</div>;

  return (
    <>
      <button onClick={exit}>나가기</button>
      {playerList.map((user) => (
        <li key={user.userId} onClick={() => console.log(user)}>
          {user.username} - {user.g_connected ? "온라인" : "오프라인"}
        </li>
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
