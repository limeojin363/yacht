import GameComponent from "../../../../../components/games/__DEPRECATED__Game";
import type { GameContextValues } from "../../../../../components/games/__DEPRECATED__Game/context";
import {
  ColorFactory,
  Game,
  getInitialDBPart,
  UnavailableInteractionError,
  type GamePreset,
} from "@yacht/game-core";
import { useState } from "react";
import GamePresetComponent from "./GamePresetComponent";
import { useImmer } from "use-immer";
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
};

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
    onDiceEyeSelect: (idx, eye) => {
      setGame((prev) => {
        toastOnUnavailableInteractionError(() => {
          if (!prev.isDiceSetUsable()) {
            prev.manuallyUpdateDiceEyes([eye, eye, eye, eye, eye]);
          } else {
            const newEyes = prev.extractDiceEyes();
            newEyes[idx] = eye;
            prev.manuallyUpdateDiceEyes(newEyes);
          }
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
  const colorFactory = new ColorFactory();

  const [preset, setPreset] = useState<GamePreset>({
    alterOptionMetaList: [
      { name: "NUMBERS_3_3x", revealed: false, turn: 1 },
      {
        name: "FUSION_1&2",
        revealed: false,
        turn: 1,
      },
    ],
    playerPresetList: [
      { name: "PLAYER 1", color: colorFactory.generate().getBaseColor() },
      { name: "PLAYER 2", color: colorFactory.generate().getBaseColor() },
    ],
  });

  return { preset, setPreset };
};

const GameMain = ({ preset }: { preset: GamePreset }) => {
  const props = useProps(preset);

  return <GameComponent {...props} />;
};

const Game_SingleDevice = () => {
  const [mode, setMode] = useState<"PRESET" | "MAIN">("MAIN");
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

export default Game_SingleDevice;
