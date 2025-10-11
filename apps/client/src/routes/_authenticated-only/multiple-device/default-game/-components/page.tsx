import { useMutation, useQuery } from "@tanstack/react-query";
import { GetGameList } from "../../../../../apis/services/game/getGameList";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../../../auth";
import { GenerateGame } from "../../../../../apis/services/game/generateGame";
import { queryClient } from "../../../../../main";
import { DeleteGame } from "../../../../../apis/services/game/deleteGame";
import Header from "../../../../../components/layouts/WithHeader";

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

const useDeleteGame = () => {
  const { mutateAsync: deleteGame } = useMutation({
    mutationKey: ["deleteGame"],
    mutationFn: async (gameId: number) => {
      const res = await DeleteGame({ id: gameId });
      const { data } = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("Game deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["gameList"] });
    },
  });

  return (gameId: number) => deleteGame(gameId);
};

const ListPage = () => {
  const { data } = useGameList();
  const navigate = useNavigate();
  const { user } = useAuth();
  const generateGame = useGenerateGame();
  const deleteGame = useDeleteGame();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <h2>Game List</h2>
      {user && <button onClick={generateGame}>adsf</button>}
      <ul>
        {data.games.map((game) => (
          <li key={game.id}>
            <div
              onClick={() =>
                navigate({
                  to: "/multiple-device/default-game/$gameId",
                  params: { gameId: String(game.id) },
                })
              }
            >
              {JSON.stringify(game)}
            </div>
            <button onClick={() => deleteGame(game.id)}>DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;
