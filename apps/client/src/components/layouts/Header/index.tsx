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
  console.log(user);
  const navigate = useNavigate();

  if (user) {
    const isAdmin = user.authority_level === 0;
    if (isAdmin) {
      return <S.RightContainer onClick={() => navigate({ to: "/admin" })}>Admin Page</S.RightContainer>;
    }
    return <S.RightContainer>Hello, {user.username}</S.RightContainer>;
  }

  return <S.RightContainer onClick={() => navigate({ to: "/login" })}>Login</S.RightContainer>;
};

const S = {
  HeaderContainer: styled.div`
    border-bottom: 2px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 16px;
  `,
  LeftContainer: styled.div``,
  RightContainer: styled.div``,
};

export default Header;
