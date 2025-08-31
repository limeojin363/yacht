import styled from "@emotion/styled";
import DefaultMode_MultipleDevice from "./games/DefaultGame_MultipleDevice";
import DefaultGame_SingleDevice from "./games/DefaultGame_SingleDevice";
import { useState } from "react";

const App = () => {
  const [gameName, setGameName] = useState<
    "DefaultMode_MultipleDevice" | "DefaultGame_SingleDevice"
  >();

  if (!gameName)
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

  switch (gameName) {
    case "DefaultMode_MultipleDevice":
      return <DefaultMode_MultipleDevice />;
    case "DefaultGame_SingleDevice":
      return <DefaultGame_SingleDevice />;
  }
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
