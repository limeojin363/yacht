import styled from "@emotion/styled";
import { Game, type AvailableHand } from "common/default-game";
import gameRootAtom, {
  currentUserNumAtom,
  diceSetAtom,
  scoreAtomFamily,
} from "../stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import ScoreCalculator from "../../../../common/src/default-game/ScoreCalculator";

interface ScoreCellProps {
  userNum: 0 | 1;
  hand: AvailableHand;
}

const calculator = new ScoreCalculator();

const ScoreCell = ({ userNum, hand }: ScoreCellProps) => {
  const setGame = useSetAtom(gameRootAtom);
  const isCurrentUser = userNum === useAtomValue(currentUserNumAtom);
  const diceSet = useAtomValue(diceSetAtom);

  // Does infinite rerendering occur?
  const currentScore = useAtomValue(
    useMemo(() => scoreAtomFamily({ userNum, hand }), [userNum, hand])
  );

  const isDicesAvailable = diceSet.every((dice) => !!dice);

  const onClick = () => {
    if (!isCurrentUser) return;
    if (!isDicesAvailable) return;

    setGame((prev) => {
      const updateAction =
        Game.getUpdateActionsFromUserAction("select", hand, prev);

      return Game.dispatch(
        updateAction, prev
      );
    });
  };

  const viewStatus: ViewStatus = (() => {
    // 이미 선택된 핸드
    if (currentScore) return "SELECTED";
    // 선택되지 않았고, 현재 유저 -> 선택 가능
    if (isCurrentUser) return "SELECTABLE";
    // 선택되지 않았고, 현재 유저도 아님 -> 표시 X
    return "EMPTY";
  })();

  const content = (()=>{
    if (currentScore) return currentScore;
    if (!isDicesAvailable) return;

    const diceEyes = diceSet.map((dice) => dice.eye);

    if (isCurrentUser) return calculator[hand](diceEyes);
  })()

  return (
    <S.Root onClick={onClick} selectable={viewStatus !== "SELECTABLE"}>
      <S.InnerText viewStatus={viewStatus}>{content}</S.InnerText>
    </S.Root>
  );
};

type ViewStatus = "EMPTY" | "SELECTABLE" | "SELECTED";

export default ScoreCell;

const S = {
  Root: styled.div<{ selectable: boolean }>`
    height: 80px;
    width: 120px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    background-color: ${({ selectable }) => (selectable ? "#f0f0f0" : "#fff")};
  `,
  InnerText: styled.div<{ viewStatus: ViewStatus }>``,
};
