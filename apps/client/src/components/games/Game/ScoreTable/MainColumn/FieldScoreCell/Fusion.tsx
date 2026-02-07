import S from "./styles";
import type { HandUnit } from "./types";

type FusionFieldScoreCellProps = {
  content: string | null;
  handUnits: [HandUnit, HandUnit];
};

export const FusionFieldScoreCell = ({
  content,
  handUnits,
}: FusionFieldScoreCellProps) => {
  return <S.Root>{/* FILL HERE */}</S.Root>;
};
