import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";

const Item = ({ onClick, text }: { onClick: () => void; text: string }) => {
  return <S.ItemWrapper onClick={onClick}>{text}</S.ItemWrapper>;
};

const GameSelector = () => {
  const navigate = useNavigate();
  return (
    <S.Root>
      <Item
        onClick={() => navigate({ to: "/multiple-device/default-game" })}
        text="Multiple Device - Default Game"
      />
      <Item
        onClick={() => navigate({ to: "/multiple-device/altered-game" })}
        text="Multiple Device - Altered Game"
      />
      <Item
        onClick={() => navigate({ to: "/single-device/default-game" })}
        text="Single Device - Default Game"
      />
      <Item
        onClick={() => navigate({ to: "/single-device/altered-game" })}
        text="Single Device - Altered Game"
      />
    </S.Root>
  );
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

export default GameSelector;
