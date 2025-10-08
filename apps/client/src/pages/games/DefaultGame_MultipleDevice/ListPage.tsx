import { useMutation, useQuery } from "@tanstack/react-query";
import { GetGameList } from "../../../apis/services/game/getGameList";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../auth";
import { GenerateGame } from "../../../apis/services/game/generateGame";
import { queryClient } from "../../../main";

const useGameList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["gameList"],
    queryFn: async () => {
      try {
        const res = await GetGameList();
        const { data } = await res.json();
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

const useGenerateGame = () => {
  const { mutateAsync: generateGame } = useMutation({
    mutationKey: ["generateGame"],
    mutationFn: async () => {
      const res = await GenerateGame({ name: "새 게임", totalPlayersNum: 2 });
      const { data } = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("Game generated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["gameList"] });
    },
  });

  return () => generateGame();
};

const ListPage = () => {
  const { data } = useGameList();
  const navigate = useNavigate();
  const { user } = useAuth();
  const generateGame = useGenerateGame();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Game List</h2>
      {user && <button onClick={generateGame}>adsf</button>}
      <ul>
        {data.games.map((game) => (
          <li
            key={game.id}
            onClick={() =>
              navigate({
                to: "/multiple-device/default-game/$gameId",
                params: { gameId: String(game.id) },
              })
            }
          >
            {JSON.stringify(game)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;
