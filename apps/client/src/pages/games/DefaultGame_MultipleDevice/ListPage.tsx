import { useQuery } from "@tanstack/react-query";
import { GetGameList } from "../../../apis/services/game/getGameList";
import { useNavigate } from "@tanstack/react-router";

const useGameList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["gameList"],
    queryFn: async () => {
      try {
        console.log("fetch game list");
        const res = await GetGameList();
        console.log(res);
        const data = await res.json();
        if (data.games.length > 0 && !data.games[0].infoForAdmin) {
          throw new Error("No infoForAdmin in game");
        }
        return data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    initialData: null,
  });

  return { data, isPending };
};

const ListPage = () => {
  const { data } = useGameList();
  const navigate = useNavigate();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Game List</h2>
      <ul>
        {data.games.map((game) => (
          <li key={game.id} onClick={()=>navigate({
            to: "/multiple-device/default-game/$gameId",
            params: { gameId: String(game.id) },
          })}>{JSON.stringify(game)}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;
