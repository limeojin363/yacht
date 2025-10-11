import styled from "@emotion/styled";
import { useAuth } from "../../../../auth";
import Header from "../../../../components/layouts/WithHeader";

const MePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  if (user) {
    return (
      <S.Root>
        <Header />
        <h1>My Info</h1>
        <p>Username: {user.username}</p>
        <p>Authority Level: {user.authorityLevel}</p>
        <p>Game Connected: {user.gamePlayerId ? "Yes" : "No"}</p>
        <button onClick={logout}>Logout</button>
      </S.Root>
    );
  }
  return (
    <S.Root>
      <Header />
      <h1>No user info available.</h1>
    </S.Root>
  );
};

const S = {
  Root: styled.div``,
};

export default MePage;
