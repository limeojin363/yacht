import styled from "@emotion/styled";
import { AlterOptionMap, type AlterOptionMetaInfo } from "@yacht/game-core";
import { use } from "react";
import { GameContext } from "../context";

const AlterOptionMetaListView = ({
  optionMetaInfo,
}: {
  optionMetaInfo: AlterOptionMetaInfo;
}) => {
  const { revealed, turn, name } = optionMetaInfo;
  const { description } = AlterOptionMap[name];

  if (!revealed)
    return <S.ItemRoot>{`${turn}턴에 공개`}</S.ItemRoot>;

  return (
    <S.ItemRoot>
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
          <AlterOptionMetaListView
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
