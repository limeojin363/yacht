import styled from "@emotion/styled";
import { useAuth } from "../../../auth";
import { useNavigate } from "@tanstack/react-router";

const Header = () => {
  return (
    <S.HeaderContainer>
      <LeftSideArea />
      <RightSideArea />
    </S.HeaderContainer>
  );
};

const LeftSideArea = () => {
  const navigate = useNavigate();

  return (
    <S.LeftContainer onClick={() => navigate({ to: "/" })}>
      Home
    </S.LeftContainer>
  );
};

const RightSideArea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const isAdmin = user.authorityLevel === 0;
    return (
      <S.RightContainer>
        {isAdmin && (
          <S.RightItem onClick={() => navigate({ to: "/admin" })}>
            Admin Page
          </S.RightItem>
        )}
        <S.RightItem onClick={() => navigate({ to: "/me" })}>
          Hello, {user.username}
        </S.RightItem>
      </S.RightContainer>
    );
  }

  return (
    <S.RightContainer>
      <S.RightItem onClick={() => navigate({ to: "/login" })}>
        Login
      </S.RightItem>
      <S.RightItem onClick={() => navigate({ to: "/signup" })}>
        Signup
      </S.RightItem>
    </S.RightContainer>
  );
};

const S = {
  HeaderContainer: styled.div`
    border-bottom: 2px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 16px;
  `,
  LeftContainer: styled.div``,
  RightContainer: styled.div`
    display: flex;
    gap: 16px;
  `,
  RightItem: styled.div``,
};

export default Header;
