import styled from "@emotion/styled";
import { useGameContext } from "../../context";
import GlobalCellStyles from "../CellStyles";

const SideColumn = () => {
  const { scoreFieldList } = useGameContext();

  return (
    <S.Root>
      <S.HeadCell />

      <S.FootCell></S.FootCell>
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
  HeadCell: styled.th`
    ${GlobalCellStyles}
  `,
  FieldNameCell: styled.td``,
  FootCell: styled.td`
    ${GlobalCellStyles}
  `,
};

export default SideColumn;
