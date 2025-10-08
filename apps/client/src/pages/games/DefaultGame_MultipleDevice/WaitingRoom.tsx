import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import {
  generateNextDiceSet,
  getRanking,
  getUpdatedGameStatus,
  isUnavailableDiceSet,
  type AvailableHand,
  type GameStatus,
  type PlayerId,
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

export type Player = {
  username: string;
  userId: number;
  playerColor: `#${string}`;
  connected: number;
  playerId: PlayerId;
};

const useRoomInfo = (gameId: number) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useMemo(() => getSocket(gameId), [gameId]);
  const [currentRoomInfo, setCurrentRoomInfo] = useState<{
    playerList: (null | Player)[];
    progressType: number;
    gameStatus: GameStatus;
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

    socket.on("new-player", (newPlayer: Player) => {
      console.log("new-player", newPlayer);
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        const nextPlayerList = [...prev.playerList];
        nextPlayerList[newPlayer.playerId] = newPlayer;
        return { ...prev, playerList: nextPlayerList };
      });
    });

    socket.on("player-exited", ({ userId }) => {
      console.log("player-exited", { userId });
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

    socket.on("player-disconnected", ({ userId }) => {
      console.log("player-disconnected", { userId });
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

    socket.on("player-reconnected", ({ userId }) => {
      console.log("player-reconnected", { userId });
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
          gameStatus: getUpdatedGameStatus(prev.gameStatus)({ type, payload }),
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

  const gameStatus = currentRoomInfo?.gameStatus;

  const isMyTurn = () => {
    if (!gameStatus) return false;
    if (!user) return false;
    const myPlayerId = user.gamePlayerId;
    return gameStatus.currentPlayerId === myPlayerId;
  };

  const isSelectedHand = (playerId: number, handName: AvailableHand) =>
    !!gameStatus && gameStatus.scoreObjectList[playerId][handName] !== null;

  const isNoMoreRoll = (remainingRoll: number) => remainingRoll <= 0;

  const listeners: Pick<
    DefaultGameContextValues,
    "onClickCell" | "onClickDice" | "onClickRoll" | "onFinish"
  > = {
    onClickCell: (handName, playerId) => {
      if (!isMyTurn()) return;
      if (!gameStatus) return;
      if (!(gameStatus.currentPlayerId === playerId)) return;
      if (isSelectedHand(playerId, handName)) return;
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      socket.emit("game-interaction", {
        type: "SELECT",
        payload: handName,
      });
    },
    onClickDice: (diceIndex) => {
      if (!isMyTurn()) return;
      if (!gameStatus) return;
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      socket.emit("game-interaction", {
        type: "TOGGLE_DICE_HOLDING",
        payload: diceIndex,
      });
    },
    onClickRoll: () => {
      console.log(gameStatus?.currentPlayerId, user?.gamePlayerId);
      if (!isMyTurn()) return;
      if (!gameStatus) return;
      if (isNoMoreRoll(gameStatus.remainingRoll)) return;
      socket.emit("game-interaction", {
        type: "ROLL",
        payload: generateNextDiceSet(gameStatus.diceSet),
      });
    },
    onFinish: () => {
      if (!gameStatus) return;
      console.log("Game Finished!");
      const ranking = getRanking(gameStatus);
      console.log("Ranking:", ranking);
    },
  };

  return { currentRoomInfo, exit, start, listeners };
};

const WaitingRoom = ({ gameId }: { gameId: number }) => {
  const { currentRoomInfo, exit, start, listeners } = useRoomInfo(gameId);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.authorityLevel === 0;

  if (!currentUser) return <div>로그인 후 이용해주세요</div>;

  const isConnected = !!currentRoomInfo;
  if (!isConnected) return <div>Loading...</div>;

  const { playerList, progressType, gameStatus: gameObject } = currentRoomInfo;

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

  const isMyTurn = gameObject.currentPlayerId === currentUser.gamePlayerId;

  if (!isAvailablePlayerList(playerList))
    return <div>playerList에 null이 포함되어 있음</div>;

  if (progressType === 1)
    return (
      <DefaultGame
        playerList={playerList}
        isMyTurn={isMyTurn}
        gameStatus={gameObject}
        {...listeners}
      />
    );

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

const isAvailablePlayerList = (
  playerList: (Player | null)[]
): playerList is Player[] => {
  return playerList.every((p) => p !== null);
};
