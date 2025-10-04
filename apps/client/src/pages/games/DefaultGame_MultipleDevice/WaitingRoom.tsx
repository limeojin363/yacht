import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import {
  generateNextDiceSet,
  getUpdatedGameStatus,
  isUnavailableDiceSet,
  type AvailableHand,
  type GameStatus,
} from "@yacht/default-game";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../auth";
import DefaultGame, {
  type DefaultGameContextValues,
} from "../../../components/games/DefaultGame";

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
    progressType: number;
    gameObject: GameStatus;
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
        console.log(prev);
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

    socket.on("game-start", () => {
      console.log("game-start");
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        return { ...prev, progressType: 1 };
      });
    });

    socket.on("game-interaction", ({ type, payload }) => {
      console.log("game-interaction", { type, payload });
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        return {
          ...prev,
          gameObject: getUpdatedGameStatus(prev.gameObject)({ type, payload }),
        };
      });
    });

    return () => {
      socket.removeAllListeners();
      if (socket.active) socket.disconnect();
    };
  }, [socket, navigate]);

  const exit = () => {
    socket.emit("exit");
    navigate({ to: "/multiple-device/default-game" });
  };

  const start = () => {
    socket.emit("game-start");
  };

  const gameStatus = currentRoomInfo?.gameObject;

  const isCurrentPlayer = (playerId: number) =>
    gameStatus?.currentPlayerId === playerId;

  const isSelectedHand = (playerId: number, handName: AvailableHand) =>
    gameStatus?.playerList[playerId].scores[handName] !== null;

  const isNoMoreRoll = (remainingRoll: number) => remainingRoll <= 0;

  const listeners: Pick<
    DefaultGameContextValues,
    "onClickCell" | "onClickDice" | "onClickRoll"
  > = {
    onClickCell: (handName, playerId) => {
      if (!gameStatus) return;
      if (!isCurrentPlayer(playerId)) return;
      if (isSelectedHand(playerId, handName)) return;
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      socket.emit("game-interaction", {
        type: "SELECT",
        payload: handName,
      });
    },
    onClickDice: (diceIndex) => {
      if (!gameStatus) return;
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      socket.emit("game-interaction", {
        type: "TOGGLE_DICE_HOLDING",
        payload: diceIndex,
      });
    },
    onClickRoll: () => {
      if (!gameStatus) return;
      if (isNoMoreRoll(gameStatus.remainingRoll)) return;
      socket.emit("game-interaction", {
        type: "ROLL",
        payload: generateNextDiceSet(gameStatus.diceSet),
      });
    },
  };

  return { currentRoomInfo, exit, start, listeners };
};

const WaitingRoom = ({ gameId }: { gameId: number }) => {
  const { currentRoomInfo, exit, start, listeners } = useRoomInfo(gameId);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.authority_level === 0;

  const isConnected = !!currentRoomInfo;
  if (!isConnected) return <div>Loading...</div>;

  const { playerList, progressType, gameObject } = currentRoomInfo;

  if (progressType === 0)
    return (
      <S.Root>
        <h1>대기실</h1>
        {isAdmin && <div onClick={start}>game start</div>}
        <button onClick={exit}>나가기</button>
        {playerList.map((player) => (
          <>
            {player ? (
              <li key={player.userId} onClick={() => console.log(player)}>
                {player.username} - {player.connected ? "온라인" : "오프라인"}
              </li>
            ) : (
              "null"
            )}
          </>
        ))}
      </S.Root>
    );

  if (progressType === 1)
    return <DefaultGame gameStatus={gameObject} {...listeners} />;

  return null;
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
