import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import {
  generateNextDiceSet,
  getUpdatedGameStatus,
  isGameFinished,
  isUnavailableDiceSet,
  type AvailableHand,
  type GameStatus,
  type PlayerId,
} from "@yacht/default-game";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../../../auth";
import DefaultGame, {
  type DefaultGameContextValues,
} from "../../../../../components/games/DefaultGame";
import { toast } from "react-toastify";

const socketUrl =
  "wss://shiny-space-capybara-q5v4qxjx6vx3x75g-3000.app.github.dev";

const getAuthorizationHeader = () =>
  `Bearer ${JSON.parse(localStorage.getItem("accessToken") || "")}`;

const getRefreshHeader = () => 
  JSON.parse(localStorage.getItem("refreshToken") || "");

const getSocket = (gameId: number) => {
  return io(`${socketUrl}/game-default`, {
    query: {
      Authorization: getAuthorizationHeader(),
      Refresh: getRefreshHeader(),
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

    socket.on("refreshed", ({accessToken, refreshToken}) => {
      console.log("refreshed");
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
    })

    socket.on("error-on-connection", () => {
      toast.error("게임 접속 중 오류가 발생했습니다.", );
      navigate({ to: "/multiple-device/default-game" });
    });

    socket.on("game-interaction", ({ type, payload }) => {
      console.log("game-interaction", { type, payload });
      setCurrentRoomInfo((prev) => {
        if (!prev) return;
        const nextGameStatus = getUpdatedGameStatus(prev.gameStatus)({ type, payload });
        const nextProgressType = isGameFinished(nextGameStatus) ? 2 : 1;
        return {
          ...prev,
          gameStatus: nextGameStatus,
          progressType: nextProgressType,
        };
      });
    });

    socket.on("game-interrupted", ({ userId }) => {
      toast.error(
        `게임이 중단되었습니다. (userId: ${userId}님이 게임에서 나갔습니다.)`
      );
      navigate({ to: "/multiple-device/default-game" });
    });

    socket.on("exit-ok", () => {
      console.log("exit-ok");
      navigate({ to: "/multiple-device/default-game" });
    });

    return () => {
      console.log(1);
      socket.removeAllListeners();
      if (socket.active) socket.disconnect();
    };
  }, [socket, navigate]);

  const exit = () => {
    if (!currentRoomInfo) return;

    if (currentRoomInfo.progressType === 2) {
      navigate({ to: "/multiple-device/default-game" });
    } else socket.emit("exit");
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
    "onClickCell" | "onClickDice" | "onClickRoll" | "onExit"
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
    onExit: () => {
      exit();
    },
  };

  return { currentRoomInfo, exit, start, listeners };
};

const GamePage = ({ gameId }: { gameId: number }) => {
  const { currentRoomInfo, exit, start, listeners } = useRoomInfo(gameId);
  const { user: currentUser, isLoaded } = useAuth();
  const isAdmin = currentUser?.authorityLevel === 0;

  if (!isLoaded) return <div>Loading...</div>;
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

    return (
      <DefaultGame
        playerList={playerList}
        isMyTurn={isMyTurn}
        gameStatus={gameObject}
        {...listeners}
      />
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

export default GamePage;

const isAvailablePlayerList = (
  playerList: (Player | null)[]
): playerList is Player[] => {
  return playerList.every((p) => p !== null);
};
