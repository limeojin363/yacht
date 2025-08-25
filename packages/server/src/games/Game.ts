import { GameStatus, getInitialGameStatus } from "common/default-game";

export const GameData = (() => {
  let statusData: GameStatus = getInitialGameStatus(2);

  const getStatus = () => statusData;

  const setStatus = (newStatus: GameStatus) => {
    statusData = newStatus;
  };

  return {
    getStatus,
    setStatus,
  };
})();
