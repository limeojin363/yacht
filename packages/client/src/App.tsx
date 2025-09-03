import styled from "@emotion/styled";
import { useState } from "react";
import DefaultMode_MultipleDevice from "./pages/games/DefaultGame_MultipleDevice";
import DefaultGame_SingleDevice from "./pages/games/DefaultGame_SingleDevice";

const App = () => {
  const [gameName, setGameName] = useState<
    "DefaultMode_MultipleDevice" | "DefaultGame_SingleDevice"
  >();

  return (
    <S.Root>
      <S.Select onClick={() => setGameName("DefaultGame_SingleDevice")}>
        DefaultGame_SingleDevice
      </S.Select>
      <S.Select onClick={() => setGameName("DefaultMode_MultipleDevice")}>
        DefaultMode_MultipleDevice
      </S.Select>
    </S.Root>
  );
};

export default App;

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  `,
  Select: styled.button`
    flex: 1;
    width: 100%;
  `,
};
