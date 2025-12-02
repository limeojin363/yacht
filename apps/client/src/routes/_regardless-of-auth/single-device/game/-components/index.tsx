import GameComponent from "../../../../../components/games/Game";
import type { GameContextValues } from "../../../../../components/games/Game/context";
import {
  Game,
  getInitialDBPart,
  UnavailableInteractionError,
  type GamePreset,
} from "@yacht/game-core";
import { useState } from "react";
import GamePresetComponent from "./GamePresetComponent";
import { generateRandomColor } from "../../default-game/-components";
import {useImmer} from "use-immer"
import { toast } from "react-toastify";

const toastOnUnavailableInteractionError = (callback: () => void) => {
  try {
    callback();
  } catch (error) {
    if (error instanceof UnavailableInteractionError) {
      toast.error(error.message);
      return;
    }
    throw error;
  }
}

const useProps = (preset: GamePreset): GameContextValues => {
  const [game, setGame] = useImmer(new Game(getInitialDBPart(preset)));

  return {
    game,
    onClickCell: (handName, playerIdx) => {
      setGame((prev) => {
        toastOnUnavailableInteractionError(() => {
          prev.enterUserHandInput({
            handName,
            playerIdx,
          });
        });
      });
    },
    onClickDice: (diceIndex) => {
      setGame((prev) => {
        toastOnUnavailableInteractionError(() => {
          prev.toggleDice(diceIndex);
        });
      });
    },
    onClickRoll: () => {
      setGame((prev) => {
        toastOnUnavailableInteractionError(() => {
          const rolledDiceSet = prev.generateRolledDiceSet();
          prev.applyRolledDiceSet(rolledDiceSet);
        });
      });
    },
    onExit: () => {},
  };
};

export const usePreset = () => {
  const [preset, setPreset] = useState<GamePreset>({
    alterOptionMetaList: [],
    playerPresetList: [
      { name: "PLAYER 1", color: generateRandomColor() },
      { name: "PLAYER 2", color: generateRandomColor() },
    ],
  });

  return { preset, setPreset };
};

const GameMain = ({ preset }: { preset: GamePreset }) => {
  const props = useProps(preset);

  return <GameComponent {...props} />;
};

const AlteredGame_SingleDevice = () => {
  const [mode, setMode] = useState<"PRESET" | "MAIN">("PRESET");
  const { preset, setPreset } = usePreset();

  if (mode === "PRESET") {
    return (
      <GamePresetComponent
        preset={preset}
        setPreset={setPreset}
        setMode={setMode}
      />
    );
  }

  return <GameMain preset={preset} />;
};

export default AlteredGame_SingleDevice;
