import styled from "@emotion/styled";
import Header from "./components/Header";
import GameSelector from "./components/GameSelector";
import { useAuth } from "../../auth";

const HomePage = () => {
  const {user} = useAuth();

  console.log({user})

  return (
    <S.Root>
      <Header />
      <GameSelector />
    </S.Root>
  );
};

const S = {
  Root: styled.div``,
};

export default HomePage;
