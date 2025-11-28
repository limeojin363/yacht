import styled from "@emotion/styled";
import { AlterOptionMap } from "@yacht/game-core";
import { use } from "react";
import { GameContext } from "../context";

const AlterOptionItem = ({
  optionMetaInfo,
}: {
  optionMetaInfo: { revealed: boolean; time: number; name: string };
}) => {
  const { revealed, time, name } = optionMetaInfo;
  const { description } = AlterOptionMap[name];

  if (!revealed)
    return <S.ItemRoot>{`${time}턴에 공개`}</S.ItemRoot>;

  return (
    <S.ItemRoot>
      <S.ItemDetail>공개됨</S.ItemDetail>
      <S.ItemDetail>{name}</S.ItemDetail>
      <S.ItemDetail>{description}</S.ItemDetail>
    </S.ItemRoot>
  );
};

const AlterOptionList = () => {
  const contextValues = use(GameContext);

  return (
    <S.ListWrapper>
      <S.ListRoot>
        {contextValues.game.alterOptionMetaInfoList.map((optionMetaInfo) => (
          <AlterOptionItem
            key={optionMetaInfo.name}
            optionMetaInfo={optionMetaInfo}
          />
        ))}
      </S.ListRoot>
    </S.ListWrapper>
  );
};

const S = {
  ListWrapper: styled.div`
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    flex: 10;
    display: flex;
  `,
  ListRoot: styled.div`
    flex: 1;

    margin: 8px;
    display: flex;
    align-items: stretch;
    gap: 8px;
  `,
  ItemRoot: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
  `,
  ItemDetail: styled.div``,
};

export default AlterOptionList;
