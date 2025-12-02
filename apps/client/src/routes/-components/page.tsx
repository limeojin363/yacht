import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import Header from "../../components/layouts/WithHeader";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <S.Root>
      <Header />
      <SelectorItem
        onClick={() => navigate({ to: "/multiple-device/default-game" })}
        text="Multiple Device - Default Game"
      />
      <SelectorItem
        onClick={() => navigate({ to: "/multiple-device/altered-game" })}
        text="Multiple Device - Altered Game"
      />
      <SelectorItem
        onClick={() => navigate({ to: "/single-device/default-game" })}
        text="Single Device - Default Game"
      />
      <SelectorItem
        onClick={() => navigate({ to: "/single-device/game" })}
        text="Single Device - Altered Game"
      />
    </S.Root>
  );
};

const SelectorItem = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => {
  return <S.ItemWrapper onClick={onClick}>{text}</S.ItemWrapper>;
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
  ItemWrapper: styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid #eee;

    &:hover {
      background: #f5f5f5;
    }
  `,
};

export default HomePage;
