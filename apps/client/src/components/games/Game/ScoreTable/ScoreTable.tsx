import { useGameContext } from "../context";
import MainColumn from "./MainColumn/MainColumn";
import SideColumn from "./SideColumn/SideColumn";

const MainColumns = () => {
  const { playerList } = useGameContext();

  return (
    <>
      {playerList.map((_, idx) => (
        <MainColumn key={idx} playerIdx={idx} />
      ))}
    </>
  );
};

const ScoreTable = () => {
  return (
    <table>
      <SideColumn />
      <MainColumns />
    </table>
  );
};

export default ScoreTable;
