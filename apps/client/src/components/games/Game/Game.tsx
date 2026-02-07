import { GameProvider, type GameContextValue } from "./context";

const Game = ({ gameContext }: { gameContext: GameContextValue }) => {
  return (
    <GameProvider value={gameContext}>
      {/* Game components go here */}
    </GameProvider>
  );
};

export default Game;
