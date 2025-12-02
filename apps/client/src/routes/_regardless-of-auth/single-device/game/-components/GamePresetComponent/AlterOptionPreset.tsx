import { AlterOptionMap, type GamePreset } from "@yacht/game-core";
import styled from "@emotion/styled";
import type { usePreset } from "..";

const AlterOptionPreset = ({
  preset: { alterOptionMetaList },
  setPreset,
}: ReturnType<typeof usePreset>) => {
  const deps = [
    ...alterOptionMetaList.reduce((acc, curr) => {
      const currOption = AlterOptionMap[curr.name];
      if (!currOption) throw new Error();

      currOption.handDependencies.forEach((dep) => acc.add(dep));
      return acc;
    }, new Set<string>()),
  ];

  const [selectables, unselectables] = (() => {
    const selectables: string[] = [],
      unselectables: string[] = [];

    Object.keys(AlterOptionMap).forEach((name) => {
      const option = AlterOptionMap[name]!;
      const isSelectable = option.handDependencies.every(
        (dep) => !deps.includes(dep)
      );
      if (isSelectable) {
        selectables.push(name);
      } else {
        unselectables.push(name);
      }
    });

    return [selectables, unselectables];
  })();

  
  const addNewOption = () => {
    const maxTurn = alterOptionMetaList
      .map((meta) => meta.turn)
      .reduce((a, b) => Math.max(a, b), 0);

    setPreset((prev) => {
      return {
        ...prev,
        alterOptionMetaList: [
          ...prev.alterOptionMetaList,
          { revealed: false, name: selectables[0], turn: Math.min(maxTurn + 1, 10) },
        ],
      };
    });
  };

  const removeOption = (idx: number) => {
    setPreset((prev) => {
      const nextAlterOptionMetaList = [...prev.alterOptionMetaList];
      nextAlterOptionMetaList.splice(idx, 1);

      return {
        ...prev,
        alterOptionMetaList: nextAlterOptionMetaList,
      };
    });
  };

  const updateOption = <T extends "turn" | "name">({
    idx,
    targetProp,
    value,
  }: {
    idx: number;
    targetProp: T;
    value: GamePreset["alterOptionMetaList"][number][T];
  }) => {
    setPreset((prev) => {
      const nextAlterOptionMetaList = [...prev.alterOptionMetaList];
      nextAlterOptionMetaList[idx] = {
        ...nextAlterOptionMetaList[idx],
        [targetProp]: value,
      };

      return {
        ...prev,
        alterOptionMetaList: nextAlterOptionMetaList,
      };
    });
  };

  return (
    <S.Root>
      <div>Alter Option Preset</div>
      <S.AddButton onClick={addNewOption}>ADD</S.AddButton>
      <S.ListContainer>
        {alterOptionMetaList.map((metaInfo, idx) => (
          <S.ItemContainer key={idx}>
            <S.NameSelect
              value={metaInfo.name}
              onChange={(e) =>
                updateOption({
                  idx,
                  targetProp: "name",
                  value: e.currentTarget.value,
                })
              }
            >
              {selectables.map((name) => (
                <S.Option selectable key={name} value={name}>
                  {name}
                </S.Option>
              ))}
              {unselectables.map((name) => (
                <S.Option selectable={false} key={name} value={name}>
                  {name}
                </S.Option>
              ))}
            </S.NameSelect>
            <S.TurnSelect
              value={metaInfo.turn}
              onChange={(e) =>
                updateOption({
                  idx,
                  targetProp: "turn",
                  value: Number(e.currentTarget.value),
                })
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((turn) => (
                <S.Option selectable key={turn} value={turn}>
                  {turn}
                </S.Option>
              ))}
            </S.TurnSelect>
            <S.RemoveButton onClick={() => removeOption(idx)}>
              REMOVE
            </S.RemoveButton>
          </S.ItemContainer>
        ))}
      </S.ListContainer>
    </S.Root>
  );
};

export default AlterOptionPreset;

const S = {
  Root: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  `,
  ListContainer: styled.div`
    width: 100%;
  `,
  ItemContainer: styled.div`
    display: flex;
  `,
  NameSelect: styled.select`
    min-width: 0px;
  `,
  TurnSelect: styled.select`
  `,
  Option: styled.option<{ selectable: boolean }>`
    display: ${({ selectable }) => (selectable ? "inline" : "none")};
  `,
  DepsArea: styled.div``,
  AddButton: styled.div``,
  RemoveButton: styled.div``,
};
