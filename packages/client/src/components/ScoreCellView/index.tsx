import styled from "@emotion/styled";

export type ViewStatus = "EMPTY" | "SELECTABLE" | "SELECTED";

interface ScoreCellViewProps extends React.HTMLAttributes<HTMLDivElement> {
  viewStatus: ViewStatus;
  label?: number | string;
}

const ScoreCellView = ({ viewStatus, label, ...props }: ScoreCellViewProps) => {
  return (
    <S.Root {...props} selectable={viewStatus !== "SELECTABLE"}>
      {label && <S.InnerText viewStatus={viewStatus}>{label}</S.InnerText>}
    </S.Root>
  );
};

const BGCOLOR = {
  FILLED: {
    DEFAULT: "#ffffff0",
    HOVER: "#",
  },
};

const S = {
  Root: styled.div<{ selectable: boolean }>`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    background-color: ${({ selectable }) => (selectable ? "#f0f0f0" : "#fff")};
  `,
  InnerText: styled.div<{ viewStatus: ViewStatus }>``,
};

export default ScoreCellView;
