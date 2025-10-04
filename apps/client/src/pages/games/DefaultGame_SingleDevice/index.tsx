import {
  generateNextDiceSet,
  getInitialGameStatus,
  getUpdatedGameStatus,
  type AvailableHand,
  type TotalPlayersNum,
  type UserAction,
} from "@yacht/default-game";
import DefaultGame, {
  type DefaultGameContextValues,
} from "../../../components/games/DefaultGame";
import { useState } from "react";

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
      update({ type: "ROLL", payload: generateNextDiceSet(gameStatus.diceSet) });
    },
  };
};

const DefaultGame_SingleDevice = () => {
  return <DefaultGame {...useProps(2)} />;
};

export default DefaultGame_SingleDevice;
