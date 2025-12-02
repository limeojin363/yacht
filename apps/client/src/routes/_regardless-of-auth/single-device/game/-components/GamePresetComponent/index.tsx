import type { usePreset } from "..";
import styled from "@emotion/styled";
import AlterOptionPreset from "./AlterOptionPreset";
import PlayerPreset from "./PlayerPreset";

const GamePresetComponent = ({
  preset,
  setPreset,
  setMode,
}: ReturnType<typeof usePreset> & {
  setMode: (mode: "PRESET" | "MAIN") => void;
}) => {
  return (
    <S.Root>
      <S.Top>
        <AlterOptionPreset preset={preset} setPreset={setPreset} />
        <PlayerPreset preset={preset} setPreset={setPreset} />
      </S.Top>
      <S.StartButton onClick={() => setMode("MAIN")}>START</S.StartButton>
    </S.Root>
  );
};

export default GamePresetComponent;

const S = {
  Root: styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Top: styled.div`
    display: flex;
    width: 100%;
  `,
  StartButton: styled.button`
    all: unset;
    padding: 8px 16px;
    background-color: #4caf50;
    cursor: pointer;
  `,
};
