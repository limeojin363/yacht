import styled from "@emotion/styled";

interface ScoreCellProps {
  status: "EMPTY" | "SELECTABLE" | "SELECTED";
  value?: number | string;
  onClick?: () => void;
}

const Cell = ({ status, value, onClick }: ScoreCellProps) => {
  return (
    <S.Root onClick={onClick} selectable={status === "SELECTABLE"}>
      {value && <InnerText value={value} />}
    </S.Root>
  );
};

const InnerText = ({ value }: { value: number | string }) => {
  return <S.InnerTextWrapper>{value}</S.InnerTextWrapper>;
};

export default Cell;

const S = {
  Root: styled.div<{ selectable: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    background-color: ${({ selectable }) => (selectable ? "#f0f0f0" : "#fff")};
  `,
  InnerTextWrapper: styled.div``,
};
