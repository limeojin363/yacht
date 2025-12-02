import styled from "@emotion/styled";
import type { usePreset } from "..";
import { generateRandomColor } from "../../../default-game/-components";

const PlayerPreset = ({
  preset: { playerPresetList },
  setPreset,
}: ReturnType<typeof usePreset>) => {
  const addNewPlayer = () => {
    setPreset((prev) => {
      return {
        ...prev,
        playerPresetList: [
          ...prev.playerPresetList,
          {
            name: `PLAYER ${prev.playerPresetList.length + 1}`,
            color: "#000000",
          },
        ],
      };
    });
  };

  const removePlayer = (idx: number) => {
    setPreset((prev) => {
      const nextPlayerPresetList = [...prev.playerPresetList];
      nextPlayerPresetList.splice(idx, 1);

      return {
        ...prev,
        playerPresetList: nextPlayerPresetList,
      };
    });
  };

  const updatePlayerName = (idx: number, value: string) => {
    setPreset((prev) => {
      const nextPlayerPresetList = [...prev.playerPresetList];
      nextPlayerPresetList[idx] = {
        ...nextPlayerPresetList[idx],
        name: value,
      };

      return {
        ...prev,
        playerPresetList: nextPlayerPresetList,
      };
    });
  };

  const regeneratePlayerColor = (idx: number) => {
    setPreset((prev) => {
      const nextPlayerPresetList = [...prev.playerPresetList];
      nextPlayerPresetList[idx] = {
        ...nextPlayerPresetList[idx],
        color: generateRandomColor(),
      };

      return {
        ...prev,
        playerPresetList: nextPlayerPresetList,
      };
    });
  };

  return (
    <S.Root>
      <div>Players Preset</div>
      <S.AddButton onClick={addNewPlayer}>ADD</S.AddButton>
      <S.ListContainer>
        {playerPresetList.map((playerPreset, idx) => (
          <S.ItemContainer key={idx}>
            <input
              type="text"
              value={playerPreset.name}
              onChange={(e) => updatePlayerName(idx, e.currentTarget.value)}
            />
            <S.ColorView
              color={playerPreset.color}
              onClick={() => regeneratePlayerColor(idx)}
            />
            <S.RemoveButton onClick={() => removePlayer(idx)}>
              REMOVE
            </S.RemoveButton>
          </S.ItemContainer>
        ))}
      </S.ListContainer>
    </S.Root>
  );
};

export default PlayerPreset;

const S = {
  Root: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  `,
  ListContainer: styled.div``,
  ItemContainer: styled.div`
    height: 30px;
    display: flex;
    align-items: stretch;
  `,
  Option: styled.option<{ selectable: boolean }>`
    display: ${({ selectable }) => (selectable ? "block" : "none")};
  `,
  AddButton: styled.div``,
  RemoveButton: styled.div``,
  ColorView: styled.div<{ color: string }>`
    height: 100%;
    aspect-ratio: 1;
    background-color: ${({ color }) => color};
  `,
};
