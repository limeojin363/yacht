import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import DefaultGame, { type DefaultGameContextValues } from "../../../components/games/DefaultGame";
import {
  getInitialGameStatus,
  getUpdatedGameStatus,
  type AvailableHand,
  type TotalPlayersNum,
  type UserAction,
} from "@yacht/default-game";

const socketUrl =
  "wss://shiny-space-capybara-q5v4qxjx6vx3x75g-3000.app.github.dev";

const getAuthorizationHeader = () =>
  `Bearer ${JSON.parse(localStorage.getItem("accessToken") || "")}`;

const connect = (gameId: number) => {
  return io(`${socketUrl}/game`, {
    query: {
      Authorization: getAuthorizationHeader(),
      gameId,
    },
  });
};

const useProps = (totalPlayers: TotalPlayersNum): DefaultGameContextValues => {
  const [gameStatus, setGameStatus] = useState(
    getInitialGameStatus(totalPlayers)
  );

  const update = (userAction: UserAction) =>
    setGameStatus((prev) => getUpdatedGameStatus(prev)(userAction));

  const isCurrentPlayer = (playerId: number) =>
    gameStatus.currentPlayerId === playerId;

  const isSelectedHand = (playerId: number, handName: AvailableHand) =>
    gameStatus.playerList[playerId].scores[handName] !== null;

  const isUnavailableDiceSet = (diceSet: typeof gameStatus.diceSet) =>
    diceSet.some((dice) => dice === null);

  const isNoMoreRoll = (remainingRoll: number) => remainingRoll <= 0;

  return {
    gameStatus,
    onClickCell: (handName, playerId) => {
      if (!isCurrentPlayer(playerId)) return;
      if (isSelectedHand(playerId, handName)) return;
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      update({ type: "SELECT", payload: handName });
    },
    onClickDice: (diceIndex) => {
      if (isUnavailableDiceSet(gameStatus.diceSet)) return;
      update({ type: "TOGGLE_DICE_HOLDING", payload: diceIndex });
    },
    onClickRoll: () => {
      if (isNoMoreRoll(gameStatus.remainingRoll)) return;
      update({ type: "ROLL" });
    },
  };
};

const DefaultMode_MultipleDevice = ({ gameId }: { gameId: number }) => {
  useEffect(() => {
    const socket = connect(gameId);

    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("authenticated", () => {
      console.log("인증 완료");
    });

    return () => {
      if (socket.active) socket.disconnect();
    };
  }, [gameId]);

  return <DefaultGame />;
};

export default DefaultMode_MultipleDevice;
